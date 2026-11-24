import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryInsights, expenseCategoryColors, expenseGradient, previousMonth, ratioPercent } from '../src/lib/category-insights.mjs';

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

test('la identidad de color respeta el gasto, su icono automático y los registros antiguos por nombre', () => {
  const categories = [
    { id: 'comida', name: 'Alimentación', kind: 'expense', color: 'pink' },
    { id: 'viajes', name: 'Vacaciones', kind: 'expense', icon: 'travel' },
    { id: 'ingreso', name: 'Alimentación', kind: 'income', color: 'sand' },
  ];
  const colors = expenseCategoryColors(categories);
  assert.equal(colors.get('comida'), 'var(--category-pink)');
  assert.equal(colors.get('name:Alimentación'), colors.get('comida'));
  assert.equal(colors.get('viajes'), 'var(--category-blue)');
  assert.deepEqual(colors, expenseCategoryColors(categories.toReversed()));
});

test('el anillo distingue dos categorías del mismo color y conserva una categoría única completa', () => {
  const color = 'var(--category-leaf)';
  assert.equal(expenseGradient([{ color, share: 100 }]), `${color} 0% 100%`);
  const gradient = expenseGradient([{ color, share: 80 }, { color, share: 20 }]);
  assert.match(gradient, /var\(--theme-surface\) 79.75% 80%/);
  assert.ok(gradient.endsWith('100%'));
});
