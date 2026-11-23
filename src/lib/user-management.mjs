import { randomUUID } from 'node:crypto';
import { hashPassword, verifyPassword, tokenHash } from './password.mjs';
export class UserManagementError extends Error {}
export function validateNewUser(input) {
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new UserManagementError('Escribe un correo válido.');
  if (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 128) throw new UserManagementError('Usa una contraseña de entre 12 y 128 caracteres.');
  if (input.password !== input.confirmPassword) throw new UserManagementError('Las contraseñas nuevas no coinciden.');
  if (typeof input.currentPassword !== 'string' || !input.currentPassword || input.currentPassword.length > 128) throw new UserManagementError('Escribe tu contraseña actual.');
  return { email, password: input.password, currentPassword: input.currentPassword };
}
export async function isUserAdmin(pool, userId) {
  const [[admin]] = await pool.execute('SELECT user_id FROM user_admins WHERE user_id = ?', [userId]);
  return !!admin;
}
export async function createManagedUser(pool, creatorId, sessionToken, input) {
  const value = validateNewUser(input);
  const connection = await pool.getConnection();
  try {
    await authorizeManagement(connection, creatorId, sessionToken, value.currentPassword);
    const hash = await hashPassword(value.password);
    const id = randomUUID();
    await connection.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, value.email, hash]);
    for (const [name, kind] of [['Ingresos', 'income'], ['Alimentación', 'expense'], ['Transporte', 'expense'], ['Vivienda', 'expense'], ['Ocio', 'expense'], ['Salud', 'expense'], ['Otros', 'expense']]) await connection.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [randomUUID(), id, name, kind]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new UserManagementError('Ya existe un usuario con ese correo.');
    throw error;
  } finally { connection.release(); }
}

async function authorizeManagement(connection, creatorId, sessionToken, currentPassword) {
    await connection.beginTransaction();
    if (!(await isUserAdmin(connection, creatorId))) throw new UserManagementError('Solo el administrador puede crear usuarios.');
    const bucket = tokenHash('create-user:' + creatorId);
    await connection.execute('INSERT INTO login_limits (bucket, attempts, window_end) VALUES (?, 0, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE bucket = bucket', [bucket]);
    const [[limit]] = await connection.execute('SELECT attempts, window_end <= UTC_TIMESTAMP() AS expired FROM login_limits WHERE bucket = ? FOR UPDATE', [bucket]);
    if (!limit.expired && limit.attempts >= 8) throw new UserManagementError('Demasiados intentos. Vuelve a intentarlo en 15 minutos.');
    await connection.execute('UPDATE login_limits SET attempts = ?, window_end = IF(?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE), window_end) WHERE bucket = ?', [limit.expired ? 1 : limit.attempts + 1, limit.expired, bucket]);
    await connection.commit();
    await connection.beginTransaction();
    const [[creator]] = await connection.execute('SELECT password_hash FROM users WHERE id = ? FOR UPDATE', [creatorId]);
    const [[session]] = await connection.execute('SELECT token_hash FROM sessions WHERE user_id = ? AND token_hash = ? AND expires_at > UTC_TIMESTAMP() FOR UPDATE', [creatorId, tokenHash(typeof sessionToken === 'string' ? sessionToken : '')]);
    if (!creator || !session || !(await isUserAdmin(connection, creatorId))) throw new UserManagementError('No tienes permiso para crear usuarios.');
    if (!(await verifyPassword(currentPassword, creator.password_hash))) throw new UserManagementError('La contraseña actual no es correcta.');
}

export async function readManagedUsers(pool, requesterId) {
  if (!(await isUserAdmin(pool, requesterId))) throw new UserManagementError('Solo el administrador puede ver los usuarios.');
  const [users] = await pool.execute('SELECT u.id, u.email, u.created_at, EXISTS(SELECT 1 FROM user_admins a WHERE a.user_id = u.id) AS is_admin FROM users u ORDER BY u.created_at, u.id');
  return users.map(user => ({ id: user.id, email: user.email, created_at: user.created_at, isAdmin: !!Number(user.is_admin) }));
}
export function validateUserEdit(input) {
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new UserManagementError('Escribe un correo válido.');
  if (typeof input.currentPassword !== 'string' || !input.currentPassword || input.currentPassword.length > 128) throw new UserManagementError('Escribe tu contraseña actual.');
  if (input.password !== '' && (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 128)) throw new UserManagementError('Usa una contraseña de entre 12 y 128 caracteres.');
  if (input.password !== input.confirmPassword) throw new UserManagementError('Las contraseñas nuevas no coinciden.');
  return { email, password: input.password, currentPassword: input.currentPassword };
}
export async function managePrivateUser(pool, creatorId, sessionToken, targetId, mode, input) {
  if (typeof targetId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(targetId) || !['edit','delete'].includes(mode)) throw new UserManagementError('Elige un usuario y acción válidos.');
  if (typeof input?.currentPassword !== 'string' || !input.currentPassword || input.currentPassword.length > 128) throw new UserManagementError('Escribe tu contraseña actual.');
  const value = mode === 'edit' ? validateUserEdit(input) : null;
  const connection = await pool.getConnection();
  try {
    await authorizeManagement(connection, creatorId, sessionToken, input.currentPassword);
    if (targetId === creatorId || await isUserAdmin(connection, targetId)) throw new UserManagementError('La cuenta administradora está protegida. Cambia tus credenciales desde Acceso y seguridad.');
    const [[target]] = await connection.execute('SELECT email FROM users WHERE id = ? FOR UPDATE', [targetId]);
    if (!target) throw new UserManagementError('El usuario ya no está disponible.');
    if (mode === 'edit') {
      if (value.password) await connection.execute('UPDATE users SET email = ?, password_hash = ? WHERE id = ?', [value.email, await hashPassword(value.password), targetId]);
      else await connection.execute('UPDATE users SET email = ? WHERE id = ?', [value.email, targetId]);
      await connection.execute('DELETE FROM sessions WHERE user_id = ?', [targetId]);
    } else {
      if (input.confirmEmail !== target.email) throw new UserManagementError('Escribe exactamente el correo del usuario para confirmar.');
      // References always stay within one owner; delete dependents before their parents.
      for (const table of ['account_piggybanks', 'piggybank_requests', 'reward_redemptions', 'personal_rewards', 'habit_completions', 'habits', 'budgets', 'scheduled_payments', 'goal_contributions', 'goals', 'movements', 'user_preferences', 'categories', 'accounts', 'sessions']) await connection.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [targetId]);
      await connection.execute('DELETE FROM users WHERE id = ?', [targetId]);
      for (const prefix of ['settings:', 'create-user:']) await connection.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash(prefix + targetId)]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new UserManagementError('Ya existe un usuario con ese correo.');
    throw error;
  } finally { connection.release(); }
}
