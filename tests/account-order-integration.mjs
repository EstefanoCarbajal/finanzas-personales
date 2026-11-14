import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { saveAccountOrder } from '../src/lib/account-order.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.TEST_DB_NAME || process.env.DB_NAME !== process.env.TEST_DB_NAME || process.env.DB_NAME !== 'u519053982_finanzas_test') throw new Error('Usar únicamente la base exclusiva de pruebas.');

test('MySQL: el orden persiste por propietario y rechaza cuentas ajenas', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const ids = [randomUUID(), randomUUID(), randomUUID()];
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `orden-${id}@example.invalid`, 'not-a-login-hash']);
    for (const [index, id] of ids.entries()) await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [id, users[index === 2 ? 1 : 0], `Cuenta ${index}`]);
    await saveAccountOrder(pool, users[0], [ids[1], ids[0]]);
    const [rows] = await pool.execute('SELECT id FROM accounts WHERE user_id = ? ORDER BY sort_order', [users[0]]);
    assert.deepEqual(rows.map(row => row.id), [ids[1], ids[0]]);
    await assert.rejects(saveAccountOrder(pool, users[0], [ids[0], ids[2]]));
    const [foreign] = await pool.execute('SELECT sort_order FROM accounts WHERE user_id = ?', [users[1]]);
    assert.equal(foreign[0].sort_order, null);
    const [after] = await pool.execute('SELECT id FROM accounts WHERE user_id = ? ORDER BY sort_order', [users[0]]);
    assert.deepEqual(after.map(row => row.id), [ids[1], ids[0]]);
  } finally {
    for (const user of users) { await pool.execute('DELETE FROM accounts WHERE user_id = ?', [user]); await pool.execute('DELETE FROM users WHERE id = ?', [user]); }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
