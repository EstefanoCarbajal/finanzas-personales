import { totals } from './money.mjs';
import { PiggybankError, assertReservations, validatePiggybank } from './piggybank-policy.mjs';

const checkId = id => {
  if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) throw new PiggybankError('Selecciona una cuenta o alcancía válida.');
};
const todayLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export async function readPiggybanks(pool, userId) {
  const [banks] = await pool.execute('SELECT id, account_id, slot, name, amount, target_on FROM account_piggybanks WHERE user_id = ? ORDER BY account_id, slot', [userId]);
  return banks;
}

// All callers lock the owner first, including movement writers and scheduled payments.
export async function checkAccountReservations(connection, userId) {
  const [banks] = await connection.execute('SELECT account_id, amount FROM account_piggybanks WHERE user_id = ? FOR UPDATE', [userId]);
  if (!banks.length) return;
  const [accounts] = await connection.execute('SELECT id, account_type, opening_balance, opening_debt FROM accounts WHERE user_id = ? FOR UPDATE', [userId]);
  const [movements] = await connection.execute('SELECT kind, account_id, destination_id, amount FROM movements WHERE user_id = ? FOR UPDATE', [userId]);
  assertReservations(totals(movements, accounts).accounts, banks);
}

// A reservation is an allocation, never a movement, expense or transfer.
// Client-generated IDs make create retries harmless, even after release.
export async function createPiggybank(pool, userId, input) {
  checkId(input?.id); checkId(input?.account_id);
  const value = validatePiggybank(input, todayLima());
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[account]] = await connection.execute("SELECT id FROM accounts WHERE user_id = ? AND id = ? AND account_type = 'asset' FOR UPDATE", [userId, input.account_id]);
    if (!account) throw new PiggybankError('La cuenta ya no está disponible.');
    const [banks] = await connection.execute('SELECT id, slot FROM account_piggybanks WHERE user_id = ? AND account_id = ? FOR UPDATE', [userId, input.account_id]);
    // request IDs are retained independently so a delayed retry cannot reserve twice.
    const [[request]] = await connection.execute('SELECT id FROM piggybank_requests WHERE user_id = ? AND id = ? FOR UPDATE', [userId, input.id]);
    if (request) { await connection.commit(); return; }
    const slot = [1, 2, 3, 4].find(slot => !banks.some(bank => Number(bank.slot) === slot));
    if (!slot) throw new PiggybankError('Esta cuenta ya tiene cuatro alcancías. Libera una para crear otra.');
    await connection.execute('INSERT INTO piggybank_requests (id, user_id) VALUES (?, ?)', [input.id, userId]);
    await connection.execute('INSERT INTO account_piggybanks (id, user_id, account_id, slot, name, amount, target_on) VALUES (?, ?, ?, ?, ?, ?, ?)', [input.id, userId, input.account_id, slot, value.name, value.amount, value.target_on]);
    await checkAccountReservations(connection, userId);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function releasePiggybank(pool, userId, bankId) {
  checkId(bankId);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [result] = await connection.execute('DELETE FROM account_piggybanks WHERE user_id = ? AND id = ?', [userId, bankId]);
    if (!result.affectedRows) throw new PiggybankError('Esta alcancía ya se liberó o no está disponible.');
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
