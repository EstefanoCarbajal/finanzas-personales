import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { renameAccount, deleteAccount } from '../src/lib/accounts.mjs';
import { readDashboard, saveMovement, todayLima } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: account rename/delete isolate owners and preserve all linked financial data', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const ids = Array.from({ length: 6 }, () => randomUUID());
  const categoryId = randomUUID();
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `account-${id}@example.invalid`, 'not-a-login-hash']);
    for (const [index, id] of ids.entries()) await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [id, users[index === 5 ? 1 : 0], `Cuenta ${index}`]);
    await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [categoryId, users[0], 'Categoría QA', 'expense']);
    for (const [from, to] of [[ids[0], ids[1]], [ids[1], ids[0]]]) await saveMovement(pool, users[0], { request_id: randomUUID(), kind: 'transfer', account_id: from, destination_id: to, amount: '1.00', description: 'Transferencia QA', occurred_on: todayLima() });
    await renameAccount(pool, users[0], ids[0], '  Cuenta renombrada  ');
    await renameAccount(pool, users[0], ids[0], 'Cuenta renombrada');
    await assert.rejects(renameAccount(pool, users[1], ids[0], 'Ajena'));
    await assert.rejects(deleteAccount(pool, users[1], ids[0]));
    await assert.rejects(renameAccount(pool, users[0], ids[0], 'Cuenta 1'));
    const data = await readDashboard(pool, users[0]);
    assert.equal(data.accounts.find(account => account.id === ids[0]).name, 'Cuenta renombrada');
    assert.equal(data.totals.accounts[ids[0]], '0.00');
    assert.equal(data.totals.balance, '0.00');
    for (const movement of data.movements) assert.equal(movement.account_id === ids[0] ? movement.account_name : movement.destination_name, 'Cuenta renombrada');
    await assert.rejects(deleteAccount(pool, users[0], ids[0]), /historial/);
    await assert.rejects(deleteAccount(pool, users[0], ids[1]), /historial/);
    await pool.execute('INSERT INTO goals (id, user_id, account_id, name, target_amount) VALUES (?, ?, ?, ?, ?)', [randomUUID(), users[0], ids[2], 'Meta QA', '10.00']);
    await assert.rejects(deleteAccount(pool, users[0], ids[2]), /historial/);
    await pool.execute('INSERT INTO scheduled_payments (id, user_id, account_id, category_id, description, amount, due_on) VALUES (?, ?, ?, ?, ?, ?, ?)', [randomUUID(), users[0], ids[3], categoryId, 'Pago QA', '1.00', todayLima()]);
    await assert.rejects(deleteAccount(pool, users[0], ids[3]), /historial/);
    await deleteAccount(pool, users[0], ids[4]);
    await assert.rejects(deleteAccount(pool, users[0], ids[4]));
    const after = await readDashboard(pool, users[0]);
    assert.equal(after.accounts.length, 4);
    assert.deepEqual(after.movements, data.movements);
    assert.equal((await readDashboard(pool, users[1])).accounts[0].name, 'Cuenta 5');
  } finally {
    for (const user of users) {
      for (const table of ['scheduled_payments', 'goals', 'movements', 'categories', 'accounts']) await pool.execute(`DELETE FROM ${table} WHERE user_id = ?`, [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
