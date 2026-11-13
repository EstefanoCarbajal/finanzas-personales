import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { readAvatar, saveAvatar } from '../src/lib/profile.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.TEST_DB_NAME || process.env.DB_NAME !== process.env.TEST_DB_NAME) throw new Error('Usar únicamente la base exclusiva de pruebas.');

test('MySQL: avatars persist per user, reject invalid values and clean up with the owner', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  try {
    for (const user of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [user, `avatar-${user}@example.invalid`, 'not-a-login-hash']);
    assert.equal(await readAvatar(pool, users[0]), 'koala');
    await saveAvatar(pool, users[0], 'fox');
    await saveAvatar(pool, users[1], 'panda');
    assert.equal(await readAvatar(pool, users[0]), 'fox');
    assert.equal(await readAvatar(pool, users[1]), 'panda');
    await saveAvatar(pool, users[0], 'rabbit');
    assert.equal(await readAvatar(pool, users[0]), 'rabbit');
    assert.equal(await readAvatar(pool, users[1]), 'panda');
    await assert.rejects(saveAvatar(pool, users[0], 'invalid'));
    await assert.rejects(saveAvatar(pool, randomUUID(), 'koala'));
    await assert.rejects(pool.execute('UPDATE user_preferences SET avatar_id = ? WHERE user_id = ?', ['invalid', users[0]]));
    assert.equal(await readAvatar(pool, users[0]), 'rabbit');
  } finally {
    for (const user of users) await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM user_preferences WHERE user_id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
