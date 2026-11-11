import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { hashPassword, tokenHash } from '../src/lib/password.mjs';
import { login, sessionUser, revokeSession, saveMovement, readDashboard } from '../src/lib/repository.mjs';
import { cancelPayment, readPlanning, saveBudget, schedulePayment, settlePayment } from '../src/lib/planning.mjs';
import { contributeToGoal, createGoal, readGoals } from '../src/lib/goals.mjs';
import { createHabit, createPersonalReward, markHabitComplete, readHabitDashboard, redeemPersonalReward } from '../src/lib/habits.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== process.env.TEST_DB_NAME || !process.env.TEST_DB_NAME) {
  throw new Error('Configura TEST_DB_NAME con el nombre exacto de la base exclusiva de pruebas.');
}

test('MySQL: aislamiento, precisión, transferencias, sesiones y límites de acceso', async t => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const accounts = [randomUUID(), randomUUID(), randomUUID()];
  const categories = [randomUUID(), randomUUID(), randomUUID()];
  const emails = users.map(id => `test-${id}@example.invalid`);
  const password = 'Prueba-ficticia-123456';
  let token;
  const base = { kind: 'income', account_id: accounts[0], category_id: categories[0], amount: '100.00', description: 'Prueba automatizada', occurred_on: '2026-01-01' };
  const save = (user, patch = {}) => saveMovement(pool, user, { ...base, request_id: randomUUID(), ...patch });
  try {
    const hash = await hashPassword(password);
    for (let i = 0; i < users.length; i++) {
      await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [users[i], emails[i], hash]);
    }
    for (let i = 0; i < accounts.length; i++) {
      await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [accounts[i], users[i === 2 ? 1 : 0], `Prueba ${i}`]);
    }
    for (let i = 0; i < categories.length; i++) {
      await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [categories[i], users[i === 2 ? 1 : 0], `Prueba ${i}`, i === 1 ? 'expense' : 'income']);
    }

    await t.test('limita intentos aunque cambie el proceso de aplicación', async () => {
      for (let i = 0; i < 8; i++) assert.equal(await login(pool, emails[1], 'incorrecta'), null);
      assert.equal(await login(pool, emails[1], password), null);
      const [[limit]] = await pool.execute('SELECT attempts FROM login_limits WHERE bucket = ?', [tokenHash(`email:${emails[1]}`)]);
      assert.equal(limit.attempts, 8);
    });

    await t.test('transferencia atómica y céntimos exactos en DECIMAL', async () => {
      await save(users[0]);
      await save(users[0], { kind: 'expense', category_id: categories[1], amount: '10.25' });
      await save(users[0], { kind: 'transfer', category_id: null, destination_id: accounts[1], amount: '25.00' });
      const data = await readDashboard(pool, users[0]);
      assert.equal(data.movements.length, 3);
      assert.deepEqual(data.totals, { income: '100.00', expense: '10.25', balance: '89.75', accounts: { [accounts[0]]: '64.75', [accounts[1]]: '25.00' } });
      assert.deepEqual((await readDashboard(pool, users[1])).movements, []);
      assert.equal((await readDashboard(pool, users[1])).accounts.length, 1);
    });

    await t.test('rechaza cuentas, destinos y categorías de otro usuario', async () => {
      await assert.rejects(save(users[1]));
      await assert.rejects(save(users[0], { category_id: categories[2] }));
      await assert.rejects(save(users[0], { kind: 'transfer', category_id: null, destination_id: accounts[2] }));
      await assert.rejects(save(users[0], { kind: 'expense', category_id: categories[0] }));
      assert.equal((await readDashboard(pool, users[0])).movements.length, 3);
      // Database foreign keys protect ownership even if application validation is bypassed.
      await assert.rejects(pool.execute(`INSERT INTO movements (id,user_id,request_id,kind,account_id,category_id,amount,description,occurred_on)
        VALUES (?, ?, ?, 'income', ?, ?, '1.00', 'FK test', '2026-01-01')`, [randomUUID(), users[1], randomUUID(), accounts[0], categories[2]]), e => e.code === 'ER_NO_REFERENCED_ROW_2');
    });

    await t.test('evita duplicados por reenvío y aplica restricciones de importe', async () => {
      const request_id = randomUUID();
      await save(users[0], { request_id, amount: '0.10' });
      await assert.rejects(save(users[0], { request_id, amount: '0.10' }), /ya fue registrado/);
      await save(users[0], { amount: '0.20' });
      assert.equal((await readDashboard(pool, users[0])).totals.income, '100.30');
      await assert.rejects(pool.execute(`INSERT INTO movements (id,user_id,request_id,kind,account_id,category_id,amount,description,occurred_on)
        VALUES (?, ?, ?, 'income', ?, ?, '-1.00', 'CHECK test', '2026-01-01')`, [randomUUID(), users[0], randomUUID(), accounts[0], categories[0]]));
    });

    await t.test('presupuestos y pagos futuros respetan propietario y solo descuentan al confirmar', async () => {
      const dueOn = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      await saveBudget(pool, users[0], { category_id: categories[1], month: '2026-01', amount: '50.00' });
      const payment = { account_id: accounts[0], category_id: categories[1], description: 'Servicio de prueba', amount: '7.50', due_on: dueOn };
      await assert.rejects(saveBudget(pool, users[1], { category_id: categories[1], month: '2026-01', amount: '20.00' }));
      await assert.rejects(schedulePayment(pool, users[1], payment));
      await schedulePayment(pool, users[0], payment);
      let data = await readDashboard(pool, users[0]);
      assert.equal(data.totals.expense, '10.25');
      let planning = await readPlanning(pool, users[0], '2026-01');
      assert.equal(planning.budgets[0].spent, '10.25');
      assert.equal(planning.payments.length, 1);
      const paymentId = planning.payments[0].id;
      await settlePayment(pool, users[0], paymentId);
      await assert.rejects(settlePayment(pool, users[0], paymentId));
      data = await readDashboard(pool, users[0]);
      assert.equal(data.totals.expense, '17.75');
      assert.equal(data.movements.filter(m => m.description === payment.description).length, 1);
      await schedulePayment(pool, users[0], { ...payment, description: 'Pago cancelable' });
      planning = await readPlanning(pool, users[0], '2026-01');
      const cancellable = planning.payments.find(p => p.description === 'Pago cancelable');
      await cancelPayment(pool, users[0], cancellable.id);
      assert.equal((await readPlanning(pool, users[0], '2026-01')).payments.length, 0);
    });

    await t.test('metas guardan aportes como transferencias y validan el propietario', async () => {
      await createGoal(pool, users[0], { account_id: accounts[1], name: 'Fondo de prueba', target_amount: '30.00', target_on: '' });
      let goals = await readGoals(pool, users[0]);
      assert.equal(goals[0].saved, '0.00');
      const goalId = goals[0].id;
      const requestId = randomUUID();
      await contributeToGoal(pool, users[0], { goal_id: goalId, account_id: accounts[0], request_id: requestId, amount: '5.50' });
      await assert.rejects(contributeToGoal(pool, users[0], { goal_id: goalId, account_id: accounts[0], request_id: requestId, amount: '5.50' }));
      await assert.rejects(createGoal(pool, users[1], { account_id: accounts[0], name: 'Ajena', target_amount: '10.00', target_on: '' }));
      goals = await readGoals(pool, users[0]);
      assert.equal(goals[0].saved, '5.50');
      const totals = (await readDashboard(pool, users[0])).totals;
      assert.equal(totals.income, '100.30');
      assert.equal(totals.expense, '17.75');
      assert.equal(totals.accounts[accounts[0]], '52.05');
      assert.equal(totals.accounts[accounts[1]], '30.50');
    });

    await t.test('hábitos suman puntos diarios y recompensas respetan saldo y límite semanal', async () => {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      let data = await readHabitDashboard(pool, users[0], today);
      assert.equal(data.habits.length, 5);
      const habitId = data.habits[0].id;
      await markHabitComplete(pool, users[0], { habit_id: habitId, day: today });
      await assert.rejects(markHabitComplete(pool, users[0], { habit_id: habitId, day: today }));
      data = await readHabitDashboard(pool, users[0], today);
      assert.equal(data.points, 10);
      await assert.rejects(markHabitComplete(pool, users[1], { habit_id: habitId, day: today }));
      await createHabit(pool, users[0], { name: 'Estiré cinco minutos' });
      await createPersonalReward(pool, users[0], { name: 'Paseo especial', cost_points: '10' });
      data = await readHabitDashboard(pool, users[0], today);
      const rewardId = data.rewards[0].id;
      await redeemPersonalReward(pool, users[0], { reward_id: rewardId });
      await assert.rejects(redeemPersonalReward(pool, users[0], { reward_id: rewardId }));
      data = await readHabitDashboard(pool, users[0], today);
      assert.equal(data.points, 0);
      assert.equal(data.redeemedThisWeek, true);
      assert.equal(data.earned, 10);
      assert.equal(data.spent, 10);
    });

    await t.test('sesiones opacas: contraseña, expiración y revocación', async () => {
      assert.equal(await login(pool, emails[0], 'incorrecta'), null);
      assert.equal(await sessionUser(pool, 'token-inválido'), null);
      token = await login(pool, emails[0], password);
      assert.ok(token);
      assert.equal((await sessionUser(pool, token)).id, users[0]);
      const [[stored]] = await pool.execute('SELECT token_hash FROM sessions WHERE user_id = ?', [users[0]]);
      assert.notEqual(stored.token_hash, token);
      assert.equal(stored.token_hash, tokenHash(token));
      await pool.execute('UPDATE sessions SET expires_at = DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 SECOND) WHERE token_hash = ?', [tokenHash(token)]);
      assert.equal(await sessionUser(pool, token), null);
      token = await login(pool, emails[0], password);
      await revokeSession(pool, token);
      assert.equal(await sessionUser(pool, token), null);
    });

  } finally {
    // Only delete the random fixtures created by this run, never existing application data.
    for (const user of users) {
      await pool.execute('DELETE FROM budgets WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM scheduled_payments WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM goal_contributions WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM goals WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM reward_redemptions WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM personal_rewards WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM habit_completions WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM habits WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM movements WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM sessions WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM categories WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM accounts WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    for (const email of emails) await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash(`email:${email}`)]);
    await pool.end();
  }
});
