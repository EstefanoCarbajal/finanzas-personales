import { toCents, decimal, totals } from './money.mjs';
import { BANK_CODES } from './banks.mjs';
import { catalogBank, catalogCardName, modelsFor } from './card-catalog.mjs';

export class CreditError extends Error {}
function cardLabel(value, max, error) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new CreditError(error);
  return value.trim();
}

function cardIdentity(input, previous) {
  if (!Object.hasOwn(input, 'catalog_model')) {
    const bank = previous ? previous.bank_code : (input.bank_code || 'BCP');
    if (!previous && !BANK_CODES.has(bank)) throw new CreditError('Selecciona un banco.');
    let name = cardLabel(input.name, 80, 'Escribe un nombre de hasta 80 caracteres.');
    if (previous?.credit_model && name === catalogCardName(bank, previous.credit_network, previous.credit_model, previous.last_four)) {
      name = catalogCardName(bank, previous.credit_network, previous.credit_model, input.last_four);
    }
    return {
      name,
      bank_code: bank, credit_network: previous?.credit_network ?? null, credit_model: previous?.credit_model ?? null,
    };
  }
  const customBank = input.bank_code === 'other';
  if (!customBank && !catalogBank(input.bank_code)) throw new CreditError('Selecciona un banco.');
  const bank = customBank ? cardLabel(input.other_bank, 24, 'Escribe el banco (máximo 24 caracteres).') : input.bank_code;
  const network = input.network === 'other'
    ? cardLabel(input.other_network, 32, 'Escribe la red (máximo 32 caracteres).')
    : input.network;
  if (!network || (input.network !== 'other' && !['Visa', 'Mastercard', 'American Express', 'Diners Club'].includes(network))) throw new CreditError('Selecciona la red de tu tarjeta.');
  if (input.catalog_model === 'other') {
    return { name: cardLabel(input.name, 80, 'Escribe el nombre de tu tarjeta.'), bank_code: bank, credit_network: network, credit_model: null };
  }
  if (customBank || input.network === 'other' || !modelsFor(bank, network).includes(input.catalog_model)) throw new CreditError('Elige un modelo del banco y la red seleccionados.');
  const model = input.catalog_model;
  return { name: catalogCardName(bank, network, model, input.last_four), bank_code: bank, credit_network: network, credit_model: model };
}

/** @param {object} input @param {{bank_code?: string | null, credit_network?: string | null, credit_model?: string | null, last_four?: string | null} | null} [previous] */
export function validateCard(input, previous = null) {
  if (!input) throw new CreditError('Revisa los datos de tu tarjeta.');
  let limit, debt;
  try { limit = toCents(input.credit_limit); debt = toCents(input.opening_debt || '0'); }
  catch { throw new CreditError('Revisa la línea y la deuda inicial, con hasta dos decimales.'); }
  if (limit <= 0n || debt > limit) throw new CreditError('La línea debe ser positiva y cubrir la deuda inicial.');
  const lastFour = input.last_four || null;
  if (lastFour !== null && (typeof lastFour !== 'string' || !/^\d{4}$/.test(lastFour))) throw new CreditError('Escribe solo los últimos cuatro dígitos, o déjalos vacíos.');
  return { ...cardIdentity(input, previous), credit_limit: decimal(limit), opening_debt: decimal(debt), last_four: lastFour };
}

export async function createCreditCard(pool, userId, input) {
  const card = validateCard(input);
  const id = crypto.randomUUID();
  try {
    await pool.execute(`INSERT INTO accounts (id, user_id, name, account_type, credit_limit, opening_debt, last_four, bank_code, credit_network, credit_model)
      VALUES (?, ?, ?, 'credit', ?, ?, ?, ?, ?, ?)`, [id, userId, card.name, card.credit_limit, card.opening_debt, card.last_four, card.bank_code, card.credit_network, card.credit_model]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new CreditError('Ya tienes una cuenta o tarjeta con ese nombre.');
    throw error;
  }
  return id;
}

const checkCardId = id => {
  if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) throw new CreditError('La tarjeta no es válida.');
};

export async function editCreditCard(pool, userId, cardId, input) {
  checkCardId(cardId);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[card]] = await connection.execute("SELECT opening_debt, bank_code, credit_network, credit_model, last_four FROM accounts WHERE user_id = ? AND id = ? AND account_type = 'credit' FOR UPDATE", [userId, cardId]);
    if (!card) throw new CreditError('Esta tarjeta ya no está disponible.');
    // Opening debt is part of the original ledger, never client editable here.
    const value = validateCard({ ...input, opening_debt: card.opening_debt }, card);
    await connection.execute("UPDATE accounts SET name = ?, credit_limit = ?, last_four = ?, bank_code = ?, credit_network = ?, credit_model = ? WHERE user_id = ? AND id = ? AND account_type = 'credit'", [value.name, value.credit_limit, value.last_four, value.bank_code, value.credit_network, value.credit_model, userId, cardId]);
    await checkCreditLedger(connection, userId);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new CreditError('Ya tienes una cuenta o tarjeta con ese nombre.');
    throw error;
  } finally { connection.release(); }
}

export async function deleteCreditCard(pool, userId, cardId) {
  checkCardId(cardId);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[card]] = await connection.execute("SELECT opening_debt FROM accounts WHERE user_id = ? AND id = ? AND account_type = 'credit' FOR UPDATE", [userId, cardId]);
    if (!card) throw new CreditError('Esta tarjeta ya no está disponible.');
    if (toCents(card.opening_debt) !== 0n) throw new CreditError('Esta tarjeta tiene deuda inicial y no se puede eliminar.');
    // Foreign keys preserve purchases, repayments and any other linked history,
    // even when the current debt is zero. Never cascade or unlink movements.
    await connection.execute("DELETE FROM accounts WHERE user_id = ? AND id = ? AND account_type = 'credit'", [userId, cardId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2'].includes(error.code)) throw new CreditError('Esta tarjeta tiene movimientos u otros registros asociados. Conservamos su historial.');
    throw error;
  } finally { connection.release(); }
}

export function creditCards(accounts, movements) {
  const balances = totals(movements, accounts).accounts;
  return accounts.filter(a => a.account_type === 'credit').map(card => {
    const debt = -BigInt((balances[card.id] || '0.00').replace('.', ''));
    return { ...card, debt: decimal(debt), available: decimal(toCents(card.credit_limit) - debt) };
  });
}

// The caller serializes movement writes on the owner row. Current locking reads see
// the complete ledger, including the proposed write, before deciding to commit.
export async function checkCreditLedger(connection, userId) {
  const [cards] = await connection.execute("SELECT id, account_type, credit_limit, opening_debt FROM accounts WHERE user_id = ? AND account_type = 'credit' FOR UPDATE", [userId]);
  if (!cards.length) return;
  const [movements] = await connection.execute('SELECT kind, account_id, destination_id, amount FROM movements WHERE user_id = ? FOR UPDATE', [userId]);
  for (const card of creditCards(cards, movements)) {
    if (BigInt(card.debt.replace('.', '')) < 0n) throw new CreditError('El cambio dejaría un pago mayor que la deuda de la tarjeta. Revisa primero sus pagos.');
    if (BigInt(card.available.replace('.', '')) < 0n) throw new CreditError('El cambio supera la línea de crédito disponible. Revisa el importe o los movimientos de la tarjeta.');
  }
}
