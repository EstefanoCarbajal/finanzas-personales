import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { saveBudget, updateBudget, deleteBudget, readPlanning } from '../src/lib/planning.mjs';
import { saveMovement, readDashboard } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('presupuestos: edición y eliminación aisladas sin modificar gastos', async t => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const categories = [randomUUID(), randomUUID()];
  const account = randomUUID();
  const month = '2026-01';
  try {
    for (let i = 0; i < users.length; i++) {
      await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [users[i], 'budget-' + users[i] + '@example.invalid', 'not-a-login-hash']);
      await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [categories[i], users[i], 'Presupuesto QA', 'expense']);
      await saveBudget(pool, users[i], { category_id: categories[i], month, amount: '100.00' });
    }
    await saveBudget(pool, users[0], { category_id: categories[0], month: '2026-02', amount: '150.00' });
    await pool.execute('INSERT INTO accounts (id, user_id, name, opening_balance) VALUES (?, ?, ?, ?)', [account, users[0], 'Cuenta QA', '100.00']);
    await saveMovement(pool, users[0], { request_id: randomUUID(), kind: 'expense', account_id: account, category_id: categories[0], amount: '25.25', description: 'Gasto conservado QA', occurred_on: '2026-01-02' });
    const budget = (await readPlanning(pool, users[0], month)).budgets[0];
    const other = (await readPlanning(pool, users[1], month)).budgets[0];
    const before = await readDashboard(pool, users[0]);
    await t.test('propietario, importes y repetición sin cambios', async () => {
      await assert.rejects(updateBudget(pool, users[1], budget.id, '20.00'), /disponible/);
      await assert.rejects(deleteBudget(pool, users[1], budget.id), /disponible/);
      for (const amount of ['0', '-1', '1.001', 'NaN', '100000000000.00']) await assert.rejects(updateBudget(pool, users[0], budget.id, amount), /importe/);
      assert.deepEqual((await readPlanning(pool, users[0], month)).budgets[0], budget);
      await updateBudget(pool, users[0], budget.id, '20.10');
      await updateBudget(pool, users[0], budget.id, '20.10');
      assert.deepEqual((await readPlanning(pool, users[0], month)).budgets[0], { ...budget, amount: '20.10' });
      assert.deepEqual((await readPlanning(pool, users[1], month)).budgets[0], other);
      assert.equal((await readPlanning(pool, users[0], '2026-02')).budgets[0].amount, '150.00');
    });
    await t.test('borrar conserva movimientos, otros meses y permite recrear', async () => {
      await deleteBudget(pool, users[0], budget.id);
      assert.equal((await readPlanning(pool, users[0], month)).budgets.length, 0);
      await assert.rejects(updateBudget(pool, users[0], budget.id, '50.00'), /disponible/);
      await assert.rejects(deleteBudget(pool, users[0], budget.id), /disponible/);
      const after = await readDashboard(pool, users[0]);
      assert.deepEqual(after.movements, before.movements);
      assert.deepEqual(after.totals, before.totals);
      assert.deepEqual((await readPlanning(pool, users[1], month)).budgets[0], other);
      assert.equal((await readPlanning(pool, users[0], '2026-02')).budgets[0].amount, '150.00');
      await saveBudget(pool, users[0], { category_id: categories[0], month, amount: '80.00' });
      const recreated = (await readPlanning(pool, users[0], month)).budgets[0];
      assert.equal(recreated.amount, '80.00');
      assert.equal(recreated.spent, '25.25');
      assert.notEqual(recreated.id, budget.id);
    });
  } finally {
    for (const user of users) {
      for (const table of ['budgets', 'movements', 'categories', 'accounts']) await pool.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
