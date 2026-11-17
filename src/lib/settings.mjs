import { hashPassword, verifyPassword, tokenHash } from './password.mjs';

export class SettingsError extends Error {}

export function validateSettings(input) {
  if (!input || !['email', 'password'].includes(input.kind)) throw new SettingsError('Elige qué quieres actualizar.');
  if (typeof input.currentPassword !== 'string' || !input.currentPassword || input.currentPassword.length > 128) throw new SettingsError('Escribe tu contraseña actual.');
  if (input.kind === 'email') {
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SettingsError('Escribe un correo válido.');
    return { ...input, email };
  }
  if (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 128) throw new SettingsError('Usa entre 12 y 128 caracteres.');
  if (input.password !== input.confirmPassword) throw new SettingsError('Las contraseñas nuevas no coinciden.');
  if (input.password === input.currentPassword) throw new SettingsError('Elige una contraseña diferente a la actual.');
  return input;
}

export async function updateCredentials(pool, userId, sessionToken, input) {
  const value = validateSettings(input);
  const connection = await pool.getConnection();
  try {
    // Commit attempts before checking the password, so failures cannot roll them back.
    await connection.beginTransaction();
    const bucket = tokenHash(`settings:${userId}`);
    await connection.execute(`INSERT INTO login_limits (bucket, attempts, window_end) VALUES (?, 0, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE bucket = bucket`, [bucket]);
    const [[limit]] = await connection.execute('SELECT attempts, window_end <= UTC_TIMESTAMP() AS expired FROM login_limits WHERE bucket = ? FOR UPDATE', [bucket]);
    if (!limit.expired && limit.attempts >= 8) throw new SettingsError('Demasiados intentos. Vuelve a intentarlo en 15 minutos.');
    await connection.execute('UPDATE login_limits SET attempts = ?, window_end = IF(?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), window_end) WHERE bucket = ?', [limit.expired ? 1 : limit.attempts + 1, limit.expired, bucket]);
    await connection.commit();
    await connection.beginTransaction();
    const [[user]] = await connection.execute('SELECT email, password_hash FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[session]] = await connection.execute('SELECT token_hash FROM sessions WHERE user_id = ? AND token_hash = ? AND expires_at > UTC_TIMESTAMP() FOR UPDATE', [userId, tokenHash(sessionToken)]);
    if (!user || !session) throw new SettingsError('Tu sesión ha terminado. Vuelve a iniciar sesión.');
    if (!await verifyPassword(value.currentPassword, user.password_hash)) throw new SettingsError('La contraseña actual no es correcta.');
    if (value.kind === 'email') {
      if (value.email === user.email.toLowerCase()) throw new SettingsError('Este ya es tu correo actual.');
      await connection.execute('UPDATE users SET email = ? WHERE id = ?', [value.email, userId]);
    } else {
      await connection.execute('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(value.password), userId]);
    }
    await connection.execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new SettingsError('No se pudo usar ese correo. Prueba con otro.');
    throw error;
  } finally { connection.release(); }
}
