import test from 'node:test';
import assert from 'node:assert/strict';
import { toCents, decimal, totals, soles } from '../src/lib/money.mjs';
import { validateMovement } from '../src/lib/repository.mjs';
import { randomUUID } from 'node:crypto';

test('decimal arithmetic stays exact, including the DECIMAL(13,2) upper bound', () => {
  assert.equal(decimal(toCents('0.10') + toCents('0.20')), '0.30');
  assert.equal(decimal(toCents('99999999999.99')), '99999999999.99');
  assert.equal(decimal(-1025n), '-10.25');
  assert.equal(soles('-0.25'), 'S/ -0.25');
  for (const amount of ['1.001', '1e3', '-1', 'NaN', '', ' 1', '1,50', '100000000000.00']) assert.throws(() => toCents(amount));
});

test('transfers and savings conserve the total without inflating expenses', () => {
  const movements = [
    { kind: 'income', account_id: 'a', amount: '100.00' },
    { kind: 'expense', account_id: 'a', amount: '10.25' },
    { kind: 'transfer', account_id: 'a', destination_id: 'savings', amount: '25.00' },
  ];
  assert.deepEqual(totals(movements), { income: '100.00', expense: '10.25', balance: '89.75', accounts: { a: '64.75', savings: '25.00' } });
});

test('server rejects invalid dates, future payments, same-account transfers and invalid amounts', () => {
  const base = { request_id: randomUUID(), kind: 'expense', account_id: randomUUID(), category_id: randomUUID(), description: 'Almuerzo', occurred_on: '2026-01-01', amount: '10.25' };
  assert.equal(validateMovement(base).amount, '10.25');
  for (const patch of [{ amount: '0' }, { occurred_on: '2026-02-30' }, { occurred_on: '9999-01-01' }, { description: '' }, { kind: 'transfer', destination_id: base.account_id, category_id: null }, { amount: '0.001' }]) {
    assert.throws(() => validateMovement({ ...base, ...patch }));
  }
});
