import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createCategory, updateCategory, deleteCategory } from '../src/lib/categories.mjs';
import { saveBudget, schedulePayment, readPlanning } from '../src/lib/planning.mjs';
import { readDashboard, saveMovement, todayLima } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: edit/delete categories protect history, ownership, type consistency and concurrent budgets', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()], accountId = randomUUID();
  const month = todayLima().slice(0, 7);
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `category-edit-${id}@example.invalid`, 'not-a-login-hash']);
    await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [accountId, users[0], 'Cuenta QA']);
    for (const name of ['Gasto QA', 'Libre QA', 'Presupuesto QA', 'Pago QA', 'Carrera QA', 'Duplicado QA']) await createCategory(pool, users[0], { name, kind: 'expense', icon: 'tag' });
    const ids = Object.fromEntries((await readDashboard(pool, users[0])).categories.map(category => [category.name, category.id]));
    await saveMovement(pool, users[0], { request_id: randomUUID(), kind: 'expense', account_id: accountId, category_id: ids['Gasto QA'], amount: '12.34', description: 'Gasto QA', occurred_on: todayLima() });
    const renamed = { name: 'Comida QA', kind: 'expense', icon: 'food' };
    await updateCategory(pool, users[0], ids['Gasto QA'], renamed);
    await updateCategory(pool, users[0], ids['Gasto QA'], renamed);
    await assert.rejects(updateCategory(pool, users[1], ids['Gasto QA'], renamed));
    await assert.rejects(deleteCategory(pool, users[1], ids['Gasto QA']));
    await assert.rejects(updateCategory(pool, users[0], ids['Gasto QA'], { ...renamed, name: 'Duplicado QA' }));
    await assert.rejects(updateCategory(pool, users[0], ids['Gasto QA'], { name: 'No guardar', kind: 'income', icon: 'salary' }), /conserva su tipo/);
    await assert.rejects(deleteCategory(pool, users[0], ids['Gasto QA']), /historial/);
    await saveBudget(pool, users[0], { category_id: ids['Presupuesto QA'], month, amount: '20.00' });
    await updateCategory(pool, users[0], ids['Presupuesto QA'], { name: 'Nuevo presupuesto QA', kind: 'expense', icon: 'home' });
    assert.equal((await readPlanning(pool, users[0], month)).budgets[0].category_name, 'Nuevo presupuesto QA');
    await schedulePayment(pool, users[0], { account_id: accountId, category_id: ids['Pago QA'], amount: '1.00', description: 'Pago QA', due_on: todayLima() });
    for (const name of ['Presupuesto QA', 'Pago QA']) {
      await assert.rejects(deleteCategory(pool, users[0], ids[name]), /historial/);
      await assert.rejects(updateCategory(pool, users[0], ids[name], { name, kind: 'income', icon: 'salary' }), /conserva su tipo/);
    }
    await updateCategory(pool, users[0], ids['Libre QA'], { name: 'Ingreso libre QA', kind: 'income', icon: 'salary' });
    await deleteCategory(pool, users[0], ids['Libre QA']);
    await assert.rejects(deleteCategory(pool, users[0], ids['Libre QA']));
    const race = await Promise.allSettled([
      updateCategory(pool, users[0], ids['Carrera QA'], { name: 'Carrera QA', kind: 'income', icon: 'salary' }),
      saveBudget(pool, users[0], { category_id: ids['Carrera QA'], month, amount: '10.00' }),
    ]);
    assert.equal(race.filter(result => result.status === 'fulfilled').length, 1);
    const [[raceCategory]] = await pool.execute('SELECT kind FROM categories WHERE id = ? AND user_id = ?', [ids['Carrera QA'], users[0]]);
    const [[raceBudget]] = await pool.execute('SELECT COUNT(*) AS total FROM budgets WHERE category_id = ? AND user_id = ?', [ids['Carrera QA'], users[0]]);
    assert.equal(Number(raceBudget.total), raceCategory.kind === 'income' ? 0 : 1);
    const final = await readDashboard(pool, users[0]);
    assert.equal(final.categories.find(category => category.id === ids['Gasto QA']).name, 'Comida QA');
    assert.equal(final.categories.find(category => category.id === ids['Gasto QA']).kind, 'expense');
    assert.equal(final.movements[0].category_name, 'Comida QA');
    assert.equal(final.movements[0].amount, '12.34');
    assert.equal(final.movements[0].kind, 'expense');
    assert.equal(final.totals.balance, '-12.34');
    assert.equal(final.totals.expense, '12.34');
    assert.equal((await readDashboard(pool, users[1])).categories.length, 0);
  } finally {
    for (const user of users) {
      for (const table of ['scheduled_payments', 'budgets', 'movements', 'categories', 'accounts']) await pool.execute(`DELETE FROM ${table} WHERE user_id = ?`, [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
