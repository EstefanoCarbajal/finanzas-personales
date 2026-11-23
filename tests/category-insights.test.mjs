import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryInsights, previousMonth, ratioPercent } from '../src/lib/category-insights.mjs';

test('gastos por categoría conservan precisión, mes y moneda', () => {
  const movement = (overrides = {}) => ({ kind: 'expense', currency: 'PEN', occurred_on: '2026-11-12', category_id: 'food', category_name: 'Comida', amount: '0.10', ...overrides });
  const result = categoryInsights([movement(), movement({ amount: '0.20' }), movement({ category_id: 'home', category_name: 'Casa', amount: '12.34' }), movement({ currency: 'USD', amount: '90.00' }), movement({ kind: 'transfer', amount: '80.00' }), movement({ kind: 'income', amount: '50.00' }), movement({ occurred_on: '2026-10-31', amount: '40.00' })], '2026-11', 'PEN');
  assert.equal(result.total, 1264n);
  assert.equal(result.count, 3);
  assert.deepEqual(result.groups.map(group => [group.name, group.amount]), [['Casa', 1234n], ['Comida', 30n]]);
  assert.equal(categoryInsights([movement({ currency: 'USD' })], '2026-11', 'PEN').total, 0n);
  assert.equal(previousMonth('2026-01'), '2025-12');
  assert.equal(ratioPercent(1n, 3n), 33.33);
  assert.equal(ratioPercent(0n, 0n), 0);
});
