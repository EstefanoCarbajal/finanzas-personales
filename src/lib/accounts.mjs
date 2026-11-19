export class AccountInputError extends Error {}
import { BANK_CODES } from './banks.mjs';
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
const checkId = id => { if (!uuid(id)) throw new AccountInputError('La cuenta no es válida.'); };

export async function renameAccount(pool, userId, accountId, name, bankCode) {
  checkId(accountId);
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) throw new AccountInputError('Escribe un nombre de hasta 80 caracteres.');
  const updateBank = bankCode !== undefined;
  if (updateBank && (typeof bankCode !== 'string' || !BANK_CODES.has(bankCode))) throw new AccountInputError('Selecciona un banco.');
  try {
    const [result] = await pool.execute(`UPDATE accounts SET name = ?${updateBank ? ', bank_code = ?' : ''} WHERE user_id = ? AND id = ? AND account_type = 'asset'`, updateBank ? [name.trim(), bankCode, userId, accountId] : [name.trim(), userId, accountId]);
    if (!result.affectedRows) throw new AccountInputError('Esta cuenta ya no está disponible. Actualiza la página.');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new AccountInputError('Ya tienes una cuenta con ese nombre.');
    throw error;
  }
}

export async function deleteAccount(pool, userId, accountId) {
  checkId(accountId);
  try {
    // Referential constraints atomically protect all movements, destinations, goals and payments,
    // including concurrent inserts. Never cascade or unlink financial history.
    const [result] = await pool.execute("DELETE FROM accounts WHERE user_id = ? AND id = ? AND account_type = 'asset'", [userId, accountId]);
    if (!result.affectedRows) throw new AccountInputError('Esta cuenta ya no está disponible. Actualiza la página.');
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') throw new AccountInputError('Esta cuenta tiene movimientos, metas, pagos o alcancías asociados. No se puede eliminar para conservar su historial.');
    throw error;
  }
}
