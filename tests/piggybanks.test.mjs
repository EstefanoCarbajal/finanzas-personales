import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePiggybank, accountAllocation, accountMovements, assertReservations } from '../src/lib/piggybank-policy.mjs';

test('alcancías: importes exactos y fechas civiles, sin importar la zona del navegador', () => {
  assert.deepEqual(validatePiggybank({ name: '  Alquiler ', amount: '10.01', target_on: '2026-12-01' }, '2026-11-19'), { name: 'Alquiler', amount: '10.01', target_on: '2026-12-01' });
  for (const amount of ['0', '-1', '1.001', 'NaN', '100000000000.00']) assert.throws(() => validatePiggybank({ name: 'Plan', amount }, '2026-11-19'));
  for (const target_on of ['2026-02-30', '2026-11-18', '2027-02-29', 'no-fecha']) assert.throws(() => validatePiggybank({ name: 'Plan', amount: '1', target_on }, '2026-11-19'));
  assert.equal(validatePiggybank({ name: 'Plan', amount: '99999999999.99' }, '2026-11-19').target_on, null);
});

test('alcancías: libre + reservado conserva saldo y no usa flotantes', () => {
  const banks = [{ account_id: 'a', amount: '0.10' }, { account_id: 'a', amount: '0.20' }];
  assert.deepEqual(accountAllocation('100.31', banks), { reserved: '0.30', free: '100.01' });
  assertReservations({ a: '0.30', b: '-50.00' }, banks);
  assert.throws(() => assertReservations({ a: '0.29' }, banks), /saldo libre/);
  assert.deepEqual(accountAllocation('-0.01', []), { reserved: '0.00', free: '-0.01' });
  assert.deepEqual(accountAllocation('400000000000.00', Array.from({ length: 4 }, () => ({ amount: '99999999999.99' }))), { reserved: '399999999999.96', free: '0.04' });
});

test('historial de cuenta: incluye origen y destino una sola vez', () => {
  const movements = [{ id: 1, account_id: 'a', destination_id: null }, { id: 2, account_id: 'b', destination_id: 'a' }, { id: 3, account_id: 'a', destination_id: 'b' }, { id: 4, account_id: 'c', destination_id: null }];
  assert.deepEqual(accountMovements(movements, 'a').map(m => m.id), [1, 2, 3]);
  assert.deepEqual(accountMovements(movements, 'new'), []);
});
