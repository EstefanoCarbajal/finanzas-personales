import { randomUUID } from 'node:crypto';
import { hashPassword, tokenHash } from './password.mjs';

export class RegistrationError extends Error {}

export function validateRegistration(input) {
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new RegistrationError('Escribe un correo válido.');
  if (typeof input?.password !== 'string' || input.password.length < 12 || input.password.length > 128) throw new RegistrationError('Usa una contraseña de entre 12 y 128 caracteres.');
  if (input.password !== input.confirmPassword) throw new RegistrationError('Las contraseñas no coinciden.');
  return { email, password: input.password };
}

export async function registerUser(pool, input) {
  const value = validateRegistration(input);
  const connection = await pool.getConnection();
  try {
    // Keep registration attempts separate from login and commit them even on duplicate emails.
    await connection.beginTransaction();
    for (const [key, maximum] of [['registration:global', 30], [`registration:email:${value.email}`, 5]]) {
      const bucket = tokenHash(key);
      await connection.execute('INSERT INTO login_limits (bucket, attempts, window_end) VALUES (?, 0, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE bucket = bucket', [bucket]);
      const [[limit]] = await connection.execute('SELECT attempts, window_end <= UTC_TIMESTAMP() AS expired FROM login_limits WHERE bucket = ? FOR UPDATE', [bucket]);
      if (!limit.expired && limit.attempts >= maximum) { await connection.rollback(); throw new RegistrationError('Demasiados intentos. Vuelve a intentarlo en 15 minutos.'); }
      await connection.execute('UPDATE login_limits SET attempts = ?, window_end = IF(?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), window_end) WHERE bucket = ?', [limit.expired ? 1 : limit.attempts + 1, limit.expired, bucket]);
    }
    await connection.commit();
    const [[admin]] = await connection.execute('SELECT user_id FROM user_admins LIMIT 1');
    if (!admin) throw new RegistrationError('El registro aún no está disponible.');
    const passwordHash = await hashPassword(value.password);
    await connection.beginTransaction();
    const id = randomUUID();
    try { await connection.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, value.email, passwordHash]); }
    catch (error) { if (error.code === 'ER_DUP_ENTRY') { await connection.rollback(); return; } throw error; }
    for (const [name, kind] of [['Ingresos', 'income'], ['Alimentación', 'expense'], ['Transporte', 'expense'], ['Vivienda', 'expense'], ['Ocio', 'expense'], ['Salud', 'expense'], ['Otros', 'expense']]) {
      await connection.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [randomUUID(), id, name, kind]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally { connection.release(); }
}
