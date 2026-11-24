import test from 'node:test';
import assert from 'node:assert/strict';
import { readDashboard } from '../src/lib/repository.mjs';

test('dashboard restores numeric MySQL selections as booleans for the owner', async () => {
  const calls = [];
  const pool = { execute: async (sql, params) => {
    calls.push({ sql, params });
    if (sql.includes('FROM accounts')) return [[
      { id: 'included', name: 'Incluida', account_type: 'asset', opening_balance: '50.00', summary_selected: 1 },
      { id: 'excluded', name: 'Excluida', account_type: 'asset', opening_balance: '30.00', summary_selected: 0 },
    ]];
    return [[]];
  } };
  const data = await readDashboard(pool, 'owner');
  assert.deepEqual(data.accounts.map(account => account.summary_selected), [true, false]);
  assert.deepEqual(data.accounts.filter(account => account.summary_selected).map(account => account.id), ['included']);
  assert.equal(data.totals.accounts.excluded, '30.00');
  assert.ok(calls.every(call => call.params[0] === 'owner'));
});
