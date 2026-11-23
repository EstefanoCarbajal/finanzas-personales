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


test('liberación parcial: céntimos exactos, límites y saldo obsoleto', async () => {
  const { remainingAfterRelease } = await import('../src/lib/piggybank-policy.mjs');
  assert.equal(remainingAfterRelease('80.01', '20.10', '80.01'), '59.91');
  assert.equal(remainingAfterRelease('80.01', '80.01', '80.01'), '0.00');
  assert.equal(remainingAfterRelease('99999999999.99', '0.01', '99999999999.99'), '99999999999.98');
  for (const amount of ['0', '-1', '80.02', '1.001', '', 'NaN']) assert.throws(() => remainingAfterRelease('80.01', amount, '80.01'));
  assert.throws(() => remainingAfterRelease('59.91', '20.10', '80.01'), /cambió/);
  assert.throws(() => remainingAfterRelease('80.01', '20.10'), /Revisa el saldo/);
});


test('agregar dinero: céntimos exactos, importes positivos y límite DECIMAL', async () => {
  const { balanceAfterTopUp } = await import('../src/lib/piggybank-policy.mjs');
  assert.equal(balanceAfterTopUp('10.01', '20.10'), '30.11');
  assert.equal(balanceAfterTopUp('99999999999.98', '0.01'), '99999999999.99');
  for (const amount of ['0', '-1', '1.001', '', 'NaN']) assert.throws(() => balanceAfterTopUp('10.01', amount));
  assert.throws(() => balanceAfterTopUp('99999999999.99', '0.01'), /máximo/);
});


test('nombre de alcancía: recorta espacios y rechaza vacío, tipo y longitud inválidos', async () => {
  const { validatePiggybankName } = await import('../src/lib/piggybank-policy.mjs');
  assert.equal(validatePiggybankName('  Vacaciones Perú  '), 'Vacaciones Perú');
  assert.equal(validatePiggybankName('a'.repeat(60)), 'a'.repeat(60));
  for (const name of ['', '   ', null, undefined, 123, 'a'.repeat(61)]) assert.throws(() => validatePiggybankName(name), /nombre/);
});
