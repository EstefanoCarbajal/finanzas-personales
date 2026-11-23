import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePaymentEdit } from '../src/lib/payment-edit-policy.mjs';
test('edición de pagos: precisión, fechas civiles y horario futuro de Lima', () => {
  const now = new Date('2026-11-23T17:00:00Z');
  const base = { description: '  Internet  ', amount: '99.10', due_on: '2026-11-23', payment_mode: 'manual' };
  assert.deepEqual(validatePaymentEdit(base, '2026-11-23', null, now), { description: 'Internet', amount: '99.10', due_on: base.due_on, automatic_at: null });
  assert.equal(validatePaymentEdit({ ...base, payment_mode: 'automatic', automatic_time: '13:00' }, '2026-11-23', null, now).automatic_at, '2026-11-23 18:00:00');
  for (const patch of [{ amount: '0' }, { amount: '-1' }, { amount: '1.001' }, { amount: '100000000000.00' }, { description: ' ' }, { due_on: '2026-02-30' }, { due_on: '2026-11-22' }, { payment_mode: 'otro' }, { payment_mode: 'automatic', automatic_time: '12:00' }, { payment_mode: 'automatic', automatic_time: '25:00' }]) assert.throws(() => validatePaymentEdit({ ...base, ...patch }, '2026-11-23', null, now));
  assert.equal(validatePaymentEdit({ ...base, due_on: '2026-01-01' }, '2026-11-23', '2026-01-01', now).due_on, '2026-01-01');
});
