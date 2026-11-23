import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { schedulePayment, manageFuturePayment, settlePayment, readPlanning } from '../src/lib/planning.mjs';
import { readDashboard } from '../src/lib/repository.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva de pruebas TLS requerida.');
test('pagos futuros: gestión aislada y serializada con el registro automático', async t => {
  const pool = createDatabasePool(); const users = [randomUUID(), randomUUID()]; const accounts = [randomUUID(), randomUUID(), randomUUID()]; const categories = [randomUUID(), randomUUID()];
  const base = { account_id: accounts[0], category_id: categories[0], description: 'Pago QA', amount: '20.00', due_on: '2099-01-01', payment_mode: 'manual', automatic_time: '09:00' };
  try {
    for (let i = 0; i < 2; i++) {
      await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [users[i], 'payment-' + users[i] + '@example.invalid', 'not-a-login-hash']);
      await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [categories[i], users[i], 'Pago QA', 'expense']);
    }
    for (let i = 0; i < 3; i++) await pool.execute('INSERT INTO accounts (id, user_id, name, opening_balance, currency) VALUES (?, ?, ?, ?, ?)', [accounts[i], users[i === 2 ? 1 : 0], accounts[i], '100.00', i === 1 ? 'USD' : 'PEN']);
    await schedulePayment(pool, users[0], base);
    const original = (await readPlanning(pool, users[0], '2099-01')).payments[0];
    const before = await readDashboard(pool, users[0]);
    await t.test('edición exacta, referencias propias, modo y gasto todavía intacto', async () => {
      await assert.rejects(manageFuturePayment(pool, users[1], original.id, 'edit', base), /disponible/);
      await assert.rejects(manageFuturePayment(pool, users[1], original.id, 'delete'), /disponible/);
      for (const patch of [{ amount: '0' }, { category_id: categories[1] }, { account_id: accounts[2] }, { due_on: '2099-02-30' }]) await assert.rejects(manageFuturePayment(pool, users[0], original.id, 'edit', { ...base, ...patch }));
      assert.deepEqual((await readPlanning(pool, users[0], '2099-01')).payments[0], original);
      const input = { ...base, description: '  Editado QA  ', amount: '30.10', account_id: accounts[1], due_on: '2099-01-02', payment_mode: 'automatic', automatic_time: '14:30' };
      await manageFuturePayment(pool, users[0], original.id, 'edit', input);
      await manageFuturePayment(pool, users[0], original.id, 'edit', input);
      const edited = (await readPlanning(pool, users[0], '2099-01')).payments[0];
      assert.equal(edited.description, 'Editado QA'); assert.equal(edited.amount, '30.10'); assert.equal(edited.currency, 'USD'); assert.equal(edited.automatic_at, '2099-01-02 19:30:00'); assert.equal(edited.automatic_time, '14:30');
      const after = await readDashboard(pool, users[0]); assert.deepEqual(after.totals, before.totals); assert.deepEqual(after.movements, before.movements);
      await manageFuturePayment(pool, users[0], original.id, 'edit', { ...input, payment_mode: 'manual' });
      assert.equal((await readPlanning(pool, users[0], '2099-01')).payments[0].automatic_at, null);
    });
    await t.test('eliminar no crea gastos y los pagos procesados rechazan cambios', async () => {
      await manageFuturePayment(pool, users[0], original.id, 'delete');
      assert.equal((await readPlanning(pool, users[0], '2099-01')).payments.length, 0);
      await assert.rejects(manageFuturePayment(pool, users[0], original.id, 'edit', base), /procesado/);
      await assert.rejects(manageFuturePayment(pool, users[0], original.id, 'delete'), /procesado/);
      await assert.rejects(settlePayment(pool, users[0], original.id), /disponible/);
      assert.deepEqual((await readDashboard(pool, users[0])).movements, before.movements);
      await schedulePayment(pool, users[0], base);
      const next = (await readPlanning(pool, users[0], '2099-01')).payments[0];
      await pool.execute("UPDATE scheduled_payments SET due_on = '2026-01-01', automatic_at = '2026-01-01 14:00:00' WHERE user_id = ? AND id = ?", [users[0], next.id]);
      const outcomes = await Promise.allSettled([manageFuturePayment(pool, users[0], next.id, 'delete'), settlePayment(pool, users[0], next.id, true)]);
      assert.ok(outcomes.some(item => item.status === 'fulfilled'));
      const [[stored]] = await pool.execute('SELECT status FROM scheduled_payments WHERE user_id = ? AND id = ?', [users[0], next.id]);
      const [movements] = await pool.execute('SELECT id FROM movements WHERE user_id = ? AND request_id = ?', [users[0], next.id]);
      assert.ok(['cancelled', 'paid'].includes(stored.status)); assert.equal(movements.length, stored.status === 'paid' ? 1 : 0);
      await assert.rejects(manageFuturePayment(pool, users[0], next.id, 'edit', base), /procesado/);
      // Also exercise the paid branch deterministically.
      await schedulePayment(pool, users[0], base);
      const paid = (await readPlanning(pool, users[0], '2099-01')).payments[0]; await settlePayment(pool, users[0], paid.id);
      await assert.rejects(manageFuturePayment(pool, users[0], paid.id, 'delete'), /procesado/);
      await assert.rejects(manageFuturePayment(pool, users[0], paid.id, 'edit', base), /procesado/);
    });
  } finally {
    for (const user of users) { for (const table of ['scheduled_payments', 'movements', 'categories', 'accounts']) await pool.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [user]); await pool.execute('DELETE FROM users WHERE id = ?', [user]); }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users); assert.equal(Number(remaining.total), 0); await pool.end();
  }
});
