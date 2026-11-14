import test from 'node:test';
import assert from 'node:assert/strict';
import { saveAccountOrder } from '../src/lib/account-order.mjs';

const a = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const b = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const foreign = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
function fixture() {
  const calls = [];
  const connection = {
    beginTransaction: async () => calls.push('begin'),
    execute: async (sql, params) => { calls.push({ sql, params }); return sql.startsWith('SELECT') ? [[{ id: a }, { id: b }]] : [{}]; },
    commit: async () => calls.push('commit'), rollback: async () => calls.push('rollback'), release: () => calls.push('release'),
  };
  return { calls, pool: { getConnection: async () => connection } };
}
test('account ordering writes each position scoped to the owner in a transaction', async () => {
  const { pool, calls } = fixture();
  await saveAccountOrder(pool, 'owner', [b, a]);
  assert.deepEqual(calls.filter(call => call.sql?.startsWith('UPDATE')).map(call => call.params), [[0, 'owner', b], [1, 'owner', a]]);
  assert.match(calls[1].sql, /WHERE user_id = \? FOR UPDATE/);
  assert.deepEqual(calls.slice(-2), ['commit', 'release']);
});
test('account ordering rejects duplicates, missing accounts and accounts belonging to another owner', async () => {
  for (const ids of [[a, a], [a], [a, foreign]]) {
    const { pool, calls } = fixture();
    await assert.rejects(saveAccountOrder(pool, 'owner', ids));
    assert.equal(calls.some(call => call.sql?.startsWith('UPDATE')), false);
    if (calls.length) assert.deepEqual(calls.slice(-2), ['rollback', 'release']);
  }
});
