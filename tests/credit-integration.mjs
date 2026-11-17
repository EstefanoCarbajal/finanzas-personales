import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createCreditCard, creditCards, editCreditCard, deleteCreditCard } from '../src/lib/credit.mjs';
import { saveMovement, updateMovement, deleteMovement, readDashboard, todayLima } from '../src/lib/repository.mjs';
import { createGoal } from '../src/lib/goals.mjs';
import { schedulePayment } from '../src/lib/planning.mjs';
import { deleteAccount } from '../src/lib/accounts.mjs';
import { saveAccountOrder } from '../src/lib/account-order.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: credit purchases, repayments, edit/delete rollback, ownership and concurrent limits', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()]; const cash = randomUUID(); const expenseCategory = randomUUID(); const incomeCategory = randomUUID();
  const base = { description: 'QA crédito', occurred_on: todayLima() };
  const input = values => ({ ...base, request_id: randomUUID(), ...values });
  const save = values => saveMovement(pool, users[0], input(values));
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `credit-${id}@example.invalid`, 'not-a-login-hash']);
    await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [cash, users[0], 'QA efectivo']);
    for (const [id, kind] of [[expenseCategory, 'expense'], [incomeCategory, 'income']]) await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [id, users[0], kind, kind]);
    const card = await createCreditCard(pool, users[0], { name: 'QA tarjeta', credit_limit: '1000.00', opening_debt: '100.00', last_four: '0123' });
    const foreign = await createCreditCard(pool, users[1], { name: 'QA ajena', credit_limit: '500.00' });
    await assert.rejects(deleteAccount(pool, users[0], card));
    await assert.rejects(deleteAccount(pool, users[1], foreign));
    await saveAccountOrder(pool, users[0], [cash]);
    await save({ kind: 'income', account_id: cash, category_id: incomeCategory, amount: '5000.00' });
    const purchase = input({ kind: 'expense', account_id: card, category_id: expenseCategory, amount: '200.25' });
    await saveMovement(pool, users[0], purchase);
    await assert.rejects(saveMovement(pool, users[0], purchase), /ya fue registrado/);
    await save({ kind: 'transfer', account_id: cash, destination_id: card, amount: '50.25' });
    let data = await readDashboard(pool, users[0]);
    assert.equal(data.totals.balance, '4949.75'); assert.equal(data.totals.debt, '250.00'); assert.equal(data.totals.expense, '200.25'); assert.equal(data.totals.net, '4699.75');
    assert.equal(creditCards(data.accounts, data.movements)[0].available, '750.00');
    for (const value of [
      { kind: 'transfer', account_id: cash, destination_id: card, amount: '250.01' },
      { kind: 'expense', account_id: card, category_id: expenseCategory, amount: '750.01' },
      { kind: 'expense', account_id: foreign, category_id: expenseCategory, amount: '1.00' },
      { kind: 'income', account_id: card, category_id: incomeCategory, amount: '1.00' },
      { kind: 'transfer', account_id: card, destination_id: cash, amount: '1.00' },
      { kind: 'transfer', account_id: cash, destination_id: foreign, amount: '1.00' },
    ]) await assert.rejects(save(value));
    assert.deepEqual((await readDashboard(pool, users[0])).totals, data.totals);
    const purchaseId = data.movements.find(m => m.account_id === card).id;
    await assert.rejects(updateMovement(pool, users[0], purchaseId, { ...purchase, amount: '1000.00' }), /línea/);
    await updateMovement(pool, users[0], purchaseId, { ...purchase, amount: '300.25' });
    await save({ kind: 'transfer', account_id: cash, destination_id: card, amount: '100.00' });
    await assert.rejects(deleteMovement(pool, users[0], purchaseId), /pago/);
    await assert.rejects(updateMovement(pool, users[0], purchaseId, { ...purchase, account_id: cash }), /pago/);
    data = await readDashboard(pool, users[0]);
    assert.equal(data.totals.debt, '250.00'); assert.equal(data.totals.expense, '300.25');
    await assert.rejects(deleteMovement(pool, users[1], purchaseId));
    await assert.rejects(createGoal(pool, users[0], { account_id: card, name: 'No ahorrar a crédito', target_amount: '10.00' }));
    await assert.rejects(schedulePayment(pool, users[0], { account_id: card, category_id: expenseCategory, description: 'No pagar a crédito', amount: '1.00', due_on: todayLima() }));
    await assert.rejects(deleteAccount(pool, users[0], card));
    const concurrent = await createCreditCard(pool, users[0], { name: 'QA concurrente', credit_limit: '100.00' });
    const result = await Promise.allSettled([save({ kind: 'expense', account_id: concurrent, category_id: expenseCategory, amount: '60.00' }), save({ kind: 'expense', account_id: concurrent, category_id: expenseCategory, amount: '60.00' })]);
    assert.equal(result.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(result.filter(r => r.status === 'rejected').length, 1);
    const current = await readDashboard(pool, users[0]);
    assert.equal(creditCards(current.accounts, current.movements).find(c => c.id === concurrent).debt, '60.00');
    assert.equal((await readDashboard(pool, users[1])).movements.length, 0);
    const edit = { name: 'Tarjeta editada', credit_limit: '1200.00', last_four: '9876', opening_debt: '0.00' };
    await assert.rejects(editCreditCard(pool, users[1], card, edit));
    await assert.rejects(editCreditCard(pool, users[0], cash, edit));
    await assert.rejects(editCreditCard(pool, users[0], card, { ...edit, name: 'QA efectivo' }), /nombre/);
    await assert.rejects(editCreditCard(pool, users[0], card, { ...edit, credit_limit: '99.00' }), /inicial/);
    await assert.rejects(editCreditCard(pool, users[0], card, { ...edit, credit_limit: '200.00' }), /línea/);
    await assert.rejects(editCreditCard(pool, users[0], card, { ...edit, last_four: '1234567890123456' }), /dígitos/);
    await editCreditCard(pool, users[0], card, edit);
    await editCreditCard(pool, users[0], card, edit);
    const edited = await readDashboard(pool, users[0]);
    const updated = creditCards(edited.accounts, edited.movements).find(c => c.id === card);
    assert.equal(updated.name, edit.name); assert.equal(updated.last_four, '9876');
    assert.equal(updated.credit_limit, '1200.00'); assert.equal(updated.opening_debt, '100.00');
    assert.equal(updated.debt, '250.00'); assert.equal(updated.available, '950.00');
    assert.deepEqual(edited.movements.map(({ account_name, destination_name, ...m }) => m), current.movements.map(({ account_name, destination_name, ...m }) => m));
    await assert.rejects(deleteCreditCard(pool, users[1], card));
    await assert.rejects(deleteCreditCard(pool, users[0], cash));
    await assert.rejects(deleteCreditCard(pool, users[0], card), /inicial/);
    await assert.rejects(deleteCreditCard(pool, users[0], concurrent), /historial/);
    const empty = await createCreditCard(pool, users[0], { name: 'QA vacía', credit_limit: '50.00' });
    await deleteCreditCard(pool, users[0], empty);
    await assert.rejects(deleteCreditCard(pool, users[0], empty));
    const race = await Promise.allSettled([
      editCreditCard(pool, users[0], concurrent, { name: 'QA concurrente', credit_limit: '60.00', last_four: '' }),
      save({ kind: 'expense', account_id: concurrent, category_id: expenseCategory, amount: '10.00' }),
    ]);
    assert.equal(race.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(race.filter(r => r.status === 'rejected').length, 1);
    const final = await readDashboard(pool, users[0]);
    const raceCard = creditCards(final.accounts, final.movements).find(c => c.id === concurrent);
    await save({ kind: 'transfer', account_id: cash, destination_id: concurrent, amount: raceCard.debt });
    await assert.rejects(deleteCreditCard(pool, users[0], concurrent), /historial/);
    await assert.rejects(pool.execute('UPDATE accounts SET opening_debt = 1201 WHERE id = ? AND user_id = ?', [card, users[0]]));
    await assert.rejects(pool.execute('UPDATE accounts SET last_four = ? WHERE id = ? AND user_id = ?', ['abcd', card, users[0]]));
    await assert.rejects(pool.execute('UPDATE accounts SET credit_limit = 0 WHERE id = ? AND user_id = ?', [card, users[0]]));
  } finally {
    for (const user of users) {
      await pool.execute('DELETE FROM movements WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM categories WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM accounts WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0); await pool.end();
  }
});
