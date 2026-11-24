import test from 'node:test';
import assert from 'node:assert/strict';
import { readBalanceHidden, saveBalanceHidden } from '../src/lib/profile.mjs';

test('balance visibility is stored per owner and defaults to visible', async () => {
  const values = new Map();
  const pool = { execute: async (sql, params) => {
    if (sql.startsWith('SELECT')) return [[values.has(params[0]) ? { balance_hidden: values.get(params[0]) ? 1 : 0 } : undefined]];
    values.set(params[0], params[1]); return [{ affectedRows: 1 }];
  } };
  assert.equal(await readBalanceHidden(pool, 'one'), false);
  await saveBalanceHidden(pool, 'one', true);
  assert.equal(await readBalanceHidden(pool, 'one'), true);
  assert.equal(await readBalanceHidden(pool, 'two'), false);
  await saveBalanceHidden(pool, 'one', false);
  assert.equal(await readBalanceHidden(pool, 'one'), false);
  await assert.rejects(saveBalanceHidden(pool, 'one', 'true'));
});
