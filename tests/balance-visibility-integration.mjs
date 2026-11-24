import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { readAvatar, saveAvatar, readBalanceHidden, saveBalanceHidden } from '../src/lib/profile.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');
test('visibility persists independently per owner without altering avatars', async () => {
  const pool = createDatabasePool(); const ids = [randomUUID(), randomUUID()];
  try {
    for (const id of ids) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `visibility-${id}@example.invalid`, 'not-a-login-hash']);
    await saveAvatar(pool, ids[0], 'fox');
    assert.equal(await readBalanceHidden(pool, ids[0]), false);
    await saveBalanceHidden(pool, ids[0], true);
    assert.equal(await readBalanceHidden(pool, ids[0]), true);
    assert.equal(await readBalanceHidden(pool, ids[1]), false);
    assert.equal(await readAvatar(pool, ids[0]), 'fox');
    await saveAvatar(pool, ids[0], 'rabbit');
    assert.equal(await readBalanceHidden(pool, ids[0]), true);
    await saveBalanceHidden(pool, ids[0], false);
    assert.equal(await readBalanceHidden(pool, ids[0]), false);
    await assert.rejects(saveBalanceHidden(pool, randomUUID(), true));
  } finally {
    for (const id of ids) await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM user_preferences WHERE user_id IN (?, ?)', ids);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
