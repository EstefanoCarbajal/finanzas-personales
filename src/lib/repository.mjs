import { randomBytes, randomUUID } from 'node:crypto';
import { toCents, decimal, totals } from './money.mjs';
import { tokenHash, verifyPassword, dummyHash } from './password.mjs';

export class InputError extends Error {}
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
export const todayLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export function validateMovement(input) {
  const { kind, account_id, destination_id, category_id, request_id, amount, occurred_on } = input;
  if (!['income', 'expense', 'transfer'].includes(kind) || !uuid(account_id) || !uuid(request_id)) throw new InputError('Revisa el tipo y la cuenta del movimiento.');
  if (typeof input.description !== 'string' || !input.description.trim() || input.description.trim().length > 100) throw new InputError('Escribe una descripción de hasta 100 caracteres.');
  let cents;
  try { cents = toCents(amount); } catch { throw new InputError('Introduce un importe con hasta dos decimales.'); }
  if (cents <= 0n) throw new InputError('El importe debe ser mayor que cero.');
  if (typeof occurred_on !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(occurred_on) || occurred_on < '1900-01-01' || occurred_on > todayLima()) throw new InputError('Selecciona una fecha válida, no futura.');
  const date = new Date(`${occurred_on}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== occurred_on) throw new InputError('La fecha no existe.');
  if (kind === 'transfer') {
    if (!uuid(destination_id) || destination_id === account_id || category_id) throw new InputError('Elige otra cuenta de destino; una transferencia no tiene categoría.');
  } else if (!uuid(category_id) || destination_id) throw new InputError('Elige una categoría para el ingreso o gasto.');
  return { ...input, description: input.description.trim(), amount: decimal(cents), destination_id: destination_id || null, category_id: category_id || null };
}

export async function saveMovement(pool, userId, input) {
  const value = validateMovement(input);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [accounts] = await connection.execute('SELECT id FROM accounts WHERE user_id = ? AND id IN (?, ?) FOR UPDATE', [userId, value.account_id, value.destination_id]);
    if (accounts.length !== (value.kind === 'transfer' ? 2 : 1)) throw new InputError('La cuenta seleccionada no está disponible.');
    if (value.category_id) {
      const [[category]] = await connection.execute('SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = ? FOR UPDATE', [userId, value.category_id, value.kind]);
      if (!category) throw new InputError('La categoría no corresponde a este movimiento.');
    }
    // One immutable row represents both legs of a transfer; no partial transfer is possible.
    await connection.execute(`INSERT INTO movements
      (id, user_id, request_id, kind, account_id, destination_id, category_id, amount, description, occurred_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [randomUUID(), userId, value.request_id, value.kind, value.account_id, value.destination_id, value.category_id, value.amount, value.description, value.occurred_on]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new InputError('Este movimiento ya fue registrado. Actualiza la página antes de continuar.');
    throw error;
  } finally { connection.release(); }
}

export async function readDashboard(pool, userId) {
  const [accounts] = await pool.execute('SELECT id, name FROM accounts WHERE user_id = ? ORDER BY name', [userId]);
  const [categories] = await pool.execute('SELECT id, name, kind FROM categories WHERE user_id = ? ORDER BY name', [userId]);
  const [movements] = await pool.execute(`SELECT m.id, m.kind, m.account_id, m.destination_id, m.amount, m.description, m.occurred_on,
    a.name AS account_name, d.name AS destination_name, c.name AS category_name
    FROM movements m JOIN accounts a ON a.id = m.account_id AND a.user_id = m.user_id
    LEFT JOIN accounts d ON d.id = m.destination_id AND d.user_id = m.user_id
    LEFT JOIN categories c ON c.id = m.category_id AND c.user_id = m.user_id
    WHERE m.user_id = ? ORDER BY m.occurred_on DESC, m.created_at DESC, m.id`, [userId]);
  return { accounts, categories, movements, totals: totals(movements) };
}

export async function login(pool, email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 128) return null;
  const normalized = email.trim().toLowerCase();
  const connection = await pool.getConnection();
  try {
    // Persisted limits survive restarts; a shared bucket also limits random-email attempts.
    await connection.beginTransaction();
    for (const [key, maximum] of [['global', 100], [`email:${normalized}`, 8]]) {
      const bucket = tokenHash(key);
      await connection.execute(`INSERT INTO login_limits (bucket, attempts, window_end)
        VALUES (?, 0, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE bucket = bucket`, [bucket]);
      const [[limit]] = await connection.execute('SELECT attempts, window_end <= UTC_TIMESTAMP() AS expired FROM login_limits WHERE bucket = ? FOR UPDATE', [bucket]);
      if (!limit.expired && limit.attempts >= maximum) { await connection.rollback(); return null; }
      await connection.execute(`UPDATE login_limits SET attempts = ?, window_end = IF(?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), window_end) WHERE bucket = ?`, [limit.expired ? 1 : limit.attempts + 1, limit.expired, bucket]);
    }
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
  const [[user]] = await pool.execute('SELECT id, password_hash FROM users WHERE email = ?', [normalized]);
  const valid = await verifyPassword(password, user?.password_hash || dummyHash);
  if (!user || !valid) return null;
  const token = randomBytes(32).toString('hex');
  await pool.execute('DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()');
  await pool.execute('DELETE FROM login_limits WHERE window_end <= UTC_TIMESTAMP()');
  await pool.execute('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY))', [tokenHash(token), user.id]);
  return token;
}

export async function sessionUser(pool, token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  const [[user]] = await pool.execute(`SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP()`, [tokenHash(token)]);
  return user || null;
}

export async function revokeSession(pool, token) {
  if (typeof token === 'string') await pool.execute('DELETE FROM sessions WHERE token_hash = ?', [tokenHash(token)]);
}
