import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createGoal, contributeToGoal, readGoals, manageGoal } from '../src/lib/goals.mjs';
import { readDashboard } from '../src/lib/repository.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva de pruebas con TLS requerida.');
test('metas: edición y eliminación conservan aportes, transferencias e identidad', async t => {
  const pool = createDatabasePool(); const users = [randomUUID(), randomUUID()]; const accounts = [randomUUID(), randomUUID()];
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, 'goal-' + id + '@example.invalid', 'not-a-login-hash']);
    for (const id of accounts) await pool.execute('INSERT INTO accounts (id, user_id, name, opening_balance) VALUES (?, ?, ?, ?)', [id, users[0], id, '100.00']);
    await createGoal(pool, users[0], { account_id: accounts[1], name: 'Viaje QA', target_amount: '100.00' });
    const goal = (await readGoals(pool, users[0]))[0];
    const contribution = { goal_id: goal.id, account_id: accounts[0], amount: '30.10', request_id: randomUUID() };
    await contributeToGoal(pool, users[0], contribution);
    const before = await readDashboard(pool, users[0]);
    const [history] = await pool.execute('SELECT * FROM goal_contributions WHERE user_id = ?', [users[0]]);
    await t.test('editar mantiene cuenta y ahorro, admite objetivo inferior y valida permisos', async () => {
      const input = { name: '  Mi viaje  ', target_amount: '20.00', target_on: null, account_id: accounts[0] };
      await assert.rejects(manageGoal(pool, users[1], goal.id, 'edit', input), /disponible/);
      await assert.rejects(manageGoal(pool, users[0], goal.id, 'edit', { ...input, target_amount: '0' }), /importe/);
      await manageGoal(pool, users[0], goal.id, 'edit', input);
      await manageGoal(pool, users[0], goal.id, 'edit', input);
      const edited = (await readGoals(pool, users[0]))[0];
      assert.equal(edited.name, 'Mi viaje'); assert.equal(edited.target_amount, '20.00'); assert.equal(edited.saved, '30.10'); assert.equal(edited.account_id, accounts[1]);
    });
    await t.test('eliminar oculta la meta y rechaza aportes sin borrar historial', async () => {
      await assert.rejects(manageGoal(pool, users[1], goal.id, 'delete'), /disponible/);
      await manageGoal(pool, users[0], goal.id, 'delete');
      assert.equal((await readGoals(pool, users[0])).length, 0);
      await assert.rejects(contributeToGoal(pool, users[0], { ...contribution, request_id: randomUUID() }), /disponible/);
      await assert.rejects(manageGoal(pool, users[0], goal.id, 'edit', { name: 'Reactivar', target_amount: '10.00' }), /disponible/);
      await assert.rejects(manageGoal(pool, users[0], goal.id, 'delete'), /disponible/);
      const after = await readDashboard(pool, users[0]); assert.deepEqual(after.movements, before.movements); assert.deepEqual(after.totals, before.totals);
      const [retained] = await pool.execute('SELECT * FROM goal_contributions WHERE user_id = ?', [users[0]]); assert.deepEqual(retained, history);
      const [[stored]] = await pool.execute('SELECT deleted_at FROM goals WHERE user_id = ? AND id = ?', [users[0], goal.id]); assert.ok(stored.deleted_at);
      await createGoal(pool, users[0], { account_id: accounts[1], name: 'Nueva QA', target_amount: '10.00' });
      const next = (await readGoals(pool, users[0]))[0];
      await Promise.allSettled([manageGoal(pool, users[0], next.id, 'delete'), contributeToGoal(pool, users[0], { ...contribution, goal_id: next.id, amount: '0.01', request_id: randomUUID() })]);
      assert.equal((await readGoals(pool, users[0])).length, 0);
    });
  } finally {
    for (const user of users) { for (const table of ['goal_contributions', 'goals', 'movements', 'accounts']) await pool.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [user]); await pool.execute('DELETE FROM users WHERE id = ?', [user]); }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users); assert.equal(Number(remaining.total), 0); await pool.end();
  }
});
