import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { schedulePayment, manageFuturePayment, settlePayment, readPlanning } from '../src/lib/planning.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva de pruebas TLS requerida.');
test('mensualidades y pago sin fecha se guardan por propietario y se procesan individualmente', async () => {
  const pool = createDatabasePool(), user = randomUUID(), other = randomUUID(), account = randomUUID(), category = randomUUID();
  const input = { account_id: account, category_id: category, description: 'Internet QA', amount: '12.50', due_on: '2099-01-31', months: '3', payment_mode: 'manual' };
  try {
    for (const id of [user, other]) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `schedule-${id}@example.invalid`, 'not-a-login-hash']);
    await pool.execute('INSERT INTO accounts (id, user_id, name, opening_balance) VALUES (?, ?, ?, ?)', [account, user, 'QA', '100.00']);
    await pool.execute("INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, 'expense')", [category, user, 'QA']);
    await assert.rejects(schedulePayment(pool, other, input));
    await schedulePayment(pool, user, input);
    await schedulePayment(pool, user, { ...input, description: 'Sin fecha QA', due_on: '', months: '1' });
    let items = (await readPlanning(pool, user, '2099-01')).payments;
    assert.deepEqual(items.map(p => p.due_on), ['2099-01-31', '2099-02-28', '2099-03-31', null]);
    assert.equal((await readPlanning(pool, other, '2099-01')).payments.length, 0);
    const undated = items[3], first = items[0];
    await assert.rejects(manageFuturePayment(pool, other, undated.id, 'delete'));
    await manageFuturePayment(pool, user, undated.id, 'edit', { ...input, due_on: '', description: 'Editado QA' });
    await settlePayment(pool, user, undated.id);
    await assert.rejects(settlePayment(pool, user, undated.id));
    await manageFuturePayment(pool, user, first.id, 'delete');
    items = (await readPlanning(pool, user, '2099-01')).payments;
    assert.deepEqual(items.map(p => p.due_on), ['2099-02-28', '2099-03-31']);
    const [moves] = await pool.execute('SELECT amount, description FROM movements WHERE user_id = ?', [user]);
    assert.equal(moves.length, 1); assert.equal(moves[0].amount, '12.50'); assert.equal(moves[0].description, 'Editado QA');
  } finally {
    for (const id of [user, other]) { for (const table of ['scheduled_payments', 'movements', 'categories', 'accounts']) await pool.execute(`DELETE FROM ${table} WHERE user_id = ?`, [id]); await pool.execute('DELETE FROM users WHERE id = ?', [id]); }
    await pool.end();
  }
});
