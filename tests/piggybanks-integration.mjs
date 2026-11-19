import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createPiggybank, releasePiggybank, readPiggybanks } from '../src/lib/piggybanks.mjs';
import { readDashboard, saveMovement, updateMovement, deleteMovement, todayLima } from '../src/lib/repository.mjs';
import { createGoal, contributeToGoal } from '../src/lib/goals.mjs';
import { schedulePayment, settlePayment } from '../src/lib/planning.mjs';
import { deleteAccount } from '../src/lib/accounts.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: alcancías aisladas, límite atómico, idempotencia y protección de reservas', async t => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const [account, other, usd, card] = Array.from({ length: 4 }, randomUUID);
  const category = randomUUID();
  const makeBank = (amount = '10.01', account_id = account) => ({ id: randomUUID(), account_id, name: 'Plan QA', amount });
  const movement = (amount, kind = 'expense') => ({ request_id: randomUUID(), account_id: account, category_id: category, kind, amount, description: 'Alcancías QA', occurred_on: todayLima() });
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `piggybank-${id}@example.invalid`, 'not-a-login-hash']);
    for (const [id, currency, type] of [[account, 'PEN', 'asset'], [other, 'PEN', 'asset'], [usd, 'USD', 'asset'], [card, 'PEN', 'credit']]) await pool.execute('INSERT INTO accounts (id, user_id, name, currency, account_type, opening_balance, credit_limit) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, users[0], id, currency, type, type === 'credit' ? '0.00' : '100.00', type === 'credit' ? '500.00' : null]);
    await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [category, users[0], 'Prueba', 'expense']);
    await t.test('propietario, tarjeta, saldo, reenvíos y monedas', async () => {
      await assert.rejects(createPiggybank(pool, users[1], makeBank()), /disponible/);
      await assert.rejects(createPiggybank(pool, users[0], makeBank('1.00', card)), /disponible/);
      await assert.rejects(createPiggybank(pool, users[0], makeBank('100.01')), /saldo libre/);
      const bank = makeBank('80.01');
      await createPiggybank(pool, users[0], bank);
      await createPiggybank(pool, users[0], bank);
      assert.equal((await readPiggybanks(pool, users[0])).length, 1);
      await assert.rejects(releasePiggybank(pool, users[1], bank.id), /disponible/);
      assert.equal((await readPiggybanks(pool, users[1])).length, 0);
      await createPiggybank(pool, users[0], makeBank('90.00', usd));
      const data = await readDashboard(pool, users[0]);
      assert.equal(data.totals.accounts[account], '100.00');
      assert.equal(data.movements.length, 0);
      await assert.rejects(deleteAccount(pool, users[0], account), /historial/);
      await releasePiggybank(pool, users[0], bank.id);
      await createPiggybank(pool, users[0], bank); // a delayed create after release must stay released
      assert.equal((await readPiggybanks(pool, users[0])).filter(b => b.account_id === account).length, 0);
    });
    await t.test('cinco altas simultáneas: solo cuatro espacios', async () => {
      const results = await Promise.allSettled(Array.from({ length: 5 }, () => createPiggybank(pool, users[0], makeBank('20.00'))));
      assert.equal(results.filter(r => r.status === 'fulfilled').length, 4);
      assert.equal((await readPiggybanks(pool, users[0])).filter(b => b.account_id === account).length, 4);
      await assert.rejects(pool.execute('INSERT INTO account_piggybanks (id, user_id, account_id, slot, name, amount) VALUES (?, ?, ?, ?, ?, ?)', [randomUUID(), users[0], account, 5, 'Inválida', '1.00']));
    });
    await t.test('gastos, transferencias, edición y borrado respetan dinero reservado', async () => {
      await assert.rejects(saveMovement(pool, users[0], movement('20.01')), /saldo libre/);
      await assert.rejects(saveMovement(pool, users[0], { ...movement('20.01', 'transfer'), category_id: null, destination_id: other }), /saldo libre/);
      await saveMovement(pool, users[0], movement('20.00'));
      const data = await readDashboard(pool, users[0]);
      assert.equal(data.totals.accounts[account], '80.00');
      await assert.rejects(updateMovement(pool, users[0], data.movements[0].id, movement('20.01')), /saldo libre/);
      await saveMovement(pool, users[0], { ...movement('10.00', 'transfer'), account_id: other, category_id: null, destination_id: account });
      await createPiggybank(pool, users[0], makeBank('50.00', other));
      await saveMovement(pool, users[0], movement('10.00'));
      const incoming = (await readDashboard(pool, users[0])).movements.find(m => m.destination_id === account);
      await assert.rejects(deleteMovement(pool, users[0], incoming.id), /saldo libre/);
    });
    await t.test('pagos y aportes hacen rollback, liberación habilita gasto', async () => {
      await schedulePayment(pool, users[0], { account_id: account, category_id: category, description: 'Pago QA', amount: '0.01', due_on: todayLima() });
      const [[payment]] = await pool.execute('SELECT id FROM scheduled_payments WHERE user_id = ?', [users[0]]);
      await assert.rejects(settlePayment(pool, users[0], payment.id), /saldo libre/);
      const [[status]] = await pool.execute('SELECT status FROM scheduled_payments WHERE id = ?', [payment.id]);
      assert.equal(status.status, 'scheduled');
      await createGoal(pool, users[0], { account_id: other, name: 'Meta QA', target_amount: '100.00' });
      const [[goal]] = await pool.execute('SELECT id FROM goals WHERE user_id = ?', [users[0]]);
      await assert.rejects(contributeToGoal(pool, users[0], { goal_id: goal.id, account_id: account, request_id: randomUUID(), amount: '0.01' }), /saldo libre/);
      const bank = (await readPiggybanks(pool, users[0])).find(b => b.account_id === account);
      await releasePiggybank(pool, users[0], bank.id);
      await settlePayment(pool, users[0], payment.id);
      assert.equal((await readDashboard(pool, users[0])).totals.accounts[account], '79.99');
    });
    await t.test('un gasto y una reserva concurrentes no comprometen el mismo saldo', async () => {
      // Other account has 90.00, with 50.00 already reserved.
      const results = await Promise.allSettled([
        createPiggybank(pool, users[0], makeBank('40.00', other)),
        saveMovement(pool, users[0], { ...movement('40.00'), account_id: other }),
      ]);
      assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
      const data = await readDashboard(pool, users[0]);
      const banks = (await readPiggybanks(pool, users[0])).filter(bank => bank.account_id === other);
      assert.equal(BigInt(data.totals.accounts[other].replace('.', '')) - banks.reduce((sum, bank) => sum + BigInt(bank.amount.replace('.', '')), 0n), 0n);
    });
  } finally {
    for (const user of users) {
      for (const table of ['account_piggybanks', 'piggybank_requests', 'goal_contributions', 'goals', 'scheduled_payments', 'movements', 'categories', 'accounts']) await pool.execute(`DELETE FROM ${table} WHERE user_id = ?`, [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
