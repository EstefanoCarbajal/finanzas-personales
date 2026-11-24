import { validAvatar } from './avatars.mjs';

export async function readAvatar(pool, userId) {
  const [[profile]] = await pool.execute('SELECT avatar_id FROM user_preferences WHERE user_id = ?', [userId]);
  // The existing ENUM stores this slot as panda; keep deployed schemas compatible.
  const avatarId = profile?.avatar_id === 'panda' ? 'tiger' : profile?.avatar_id;
  return validAvatar(avatarId) ? avatarId : 'koala';
}

export async function saveAvatar(pool, userId, avatarId) {
  if (!validAvatar(avatarId)) throw new Error('Elige uno de los avatares disponibles.');
  const storedId = avatarId === 'tiger' ? 'panda' : avatarId;
  await pool.execute(`INSERT INTO user_preferences (user_id, avatar_id) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE avatar_id = ?`, [userId, storedId, storedId]);
}

export async function readBalanceHidden(pool, userId) {
  const [[profile]] = await pool.execute('SELECT balance_hidden FROM user_preferences WHERE user_id = ?', [userId]);
  return Boolean(profile?.balance_hidden);
}

export async function saveBalanceHidden(pool, userId, hidden) {
  if (typeof hidden !== 'boolean') throw new Error('La preferencia no es válida.');
  await pool.execute(`INSERT INTO user_preferences (user_id, balance_hidden) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE balance_hidden = ?`, [userId, hidden, hidden]);
}
