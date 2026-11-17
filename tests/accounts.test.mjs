import test from 'node:test';
import assert from 'node:assert/strict';
import { renameAccount, deleteAccount, AccountInputError } from '../src/lib/accounts.mjs';

const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
test('account changes reject invalid ids/names before writing', async () => {
  let calls = 0;
  const pool = { execute: async () => { calls++; return [{ affectedRows: 1 }]; } };
  for (const name of ['', '   ', 'a'.repeat(81), {}, null]) await assert.rejects(renameAccount(pool, 'owner', id, name), AccountInputError);
  await assert.rejects(deleteAccount(pool, 'owner', 'invalid'), AccountInputError);
  await assert.rejects(renameAccount(pool, 'owner', 'invalid', 'Nombre'), AccountInputError);
  assert.equal(calls, 0);
});
test('rename and delete scope every write to the authenticated owner', async () => {
  const calls = [];
  const pool = { execute: async (sql, params) => { calls.push({ sql, params }); return [{ affectedRows: 1 }]; } };
  await renameAccount(pool, 'owner', id, '  Mi cuenta  ');
  await deleteAccount(pool, 'owner', id);
  assert.deepEqual(calls.map(call => call.params), [['Mi cuenta', 'owner', id], ['owner', id]]);
  for (const call of calls) assert.match(call.sql, /WHERE user_id = \? AND id = \?/);
  const missing = { execute: async () => [{ affectedRows: 0 }] };
  await assert.rejects(renameAccount(missing, 'other', id, 'Nombre'), AccountInputError);
  await assert.rejects(deleteAccount(missing, 'other', id), AccountInputError);
});
test('account conflicts preserve duplicates and referenced financial history', async () => {
  const errorPool = code => ({ execute: async () => { throw Object.assign(new Error('db conflict'), { code }); } });
  await assert.rejects(renameAccount(errorPool('ER_DUP_ENTRY'), 'owner', id, 'Nombre'), /Ya tienes una cuenta/);
  await assert.rejects(deleteAccount(errorPool('ER_ROW_IS_REFERENCED_2'), 'owner', id), /historial/);
});
