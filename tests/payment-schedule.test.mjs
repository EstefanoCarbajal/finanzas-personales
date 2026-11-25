import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentDates } from '../src/lib/payment-schedule.mjs';
import { validatePaymentEdit } from '../src/lib/payment-edit-policy.mjs';
import { automaticPaymentTime } from '../src/lib/planning.mjs';

test('mensualidades conservan el día original y ajustan meses cortos', () => {
  assert.deepEqual(paymentDates('2028-01-31', '4'), ['2028-01-31', '2028-02-29', '2028-03-31', '2028-04-30']);
  assert.deepEqual(paymentDates('2026-12-30', '2'), ['2026-12-30', '2027-01-30']);
  assert.deepEqual(paymentDates(null), [null]);
  for (const [date, count] of [[null, '2'], ['2026-02-30', '1'], ['2026-01-01', '0'], ['2026-01-01', '25'], ['9999-12-31', '2']]) assert.throws(() => paymentDates(date, count));
});
test('sin fecha solo admite confirmación manual', () => {
  const input = { description: 'Internet', amount: '99.10', due_on: '', payment_mode: 'manual' };
  assert.equal(validatePaymentEdit(input, '2026-11-25').due_on, null);
  assert.throws(() => validatePaymentEdit({ ...input, payment_mode: 'automatic', automatic_time: '09:00' }, '2026-11-25'));
  assert.throws(() => automaticPaymentTime({ ...input, payment_mode: 'automatic', automatic_time: '09:00' }));
});
