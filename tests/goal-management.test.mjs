import test from 'node:test';
import assert from 'node:assert/strict';
import { validateGoalEdit } from '../src/lib/goal-edit-policy.mjs';
test('edición de meta: nombre, céntimos, fecha opcional y fecha histórica', () => {
  const base = { name: '  Viaje Perú  ', target_amount: '20.10', target_on: null };
  assert.deepEqual(validateGoalEdit(base, '2026-11-23'), { ...base, name: 'Viaje Perú' });
  for (const target_amount of ['0', '-1', '1.001', 'NaN', '100000000000.00']) assert.throws(() => validateGoalEdit({ ...base, target_amount }, '2026-11-23'));
  for (const name of ['', '  ', 'a'.repeat(101)]) assert.throws(() => validateGoalEdit({ ...base, name }, '2026-11-23'));
  for (const target_on of ['2026-02-30', '2026-11-22', 'no-fecha']) assert.throws(() => validateGoalEdit({ ...base, target_on }, '2026-11-23'));
  assert.equal(validateGoalEdit({ ...base, target_on: '2026-01-01' }, '2026-11-23', '2026-01-01').target_on, '2026-01-01');
  assert.equal(validateGoalEdit({ ...base, target_amount: '99999999999.99' }, '2026-11-23').target_amount, '99999999999.99');
});
