import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentTotals } from '../src/lib/payment-totals.mjs';

test('suma importes exactos y mantiene las monedas separadas', () => {
  assert.deepEqual(paymentTotals([
    { amount: '0.10' }, { amount: '0.20', currency: 'PEN' },
    { amount: '99999999999.99', currency: 'USD' }, { amount: '0.01', currency: 'USD' },
  ]), [{ currency: 'PEN', amount: '0.30' }, { currency: 'USD', amount: '100000000000.00' }]);
  assert.deepEqual(paymentTotals([]), []);
});
