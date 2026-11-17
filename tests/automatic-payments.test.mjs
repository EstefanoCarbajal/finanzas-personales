import test from 'node:test';
import assert from 'node:assert/strict';
import { automaticPaymentTime } from '../src/lib/planning.mjs';
test('automatic schedule validates future Lima times and converts to UTC across midnight', () => {
  const now = new Date('2026-11-16T18:00:00Z');
  assert.equal(automaticPaymentTime({ payment_mode: 'manual' }, now), null);
  assert.equal(automaticPaymentTime({ payment_mode: 'automatic', due_on: '2026-11-16', automatic_time: '23:30' }, now), '2026-11-17 04:30:00');
  for (const [due_on, automatic_time] of [['2026-02-30','23:00'],['2026-11-17','24:00'],['2026-11-16','12:59']]) assert.throws(()=>automaticPaymentTime({ payment_mode:'automatic',due_on,automatic_time },now));
});
