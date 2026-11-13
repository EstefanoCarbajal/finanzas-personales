import { validAvatar } from './avatars.mjs';

export async function readAvatar(pool, userId) {
  const [[profile]] = await pool.execute('SELECT avatar_id FROM user_preferences WHERE user_id = ?', [userId]);
  return validAvatar(profile?.avatar_id) ? profile.avatar_id : 'koala';
}

export async function saveAvatar(pool, userId, avatarId) {
  if (!validAvatar(avatarId)) throw new Error('Elige uno de los avatares disponibles.');
  await pool.execute(`INSERT INTO user_preferences (user_id, avatar_id) VALUES (?, ?)
    ON DUPLICATE KEY UPDATE avatar_id = ?`, [userId, avatarId, avatarId]);
}
