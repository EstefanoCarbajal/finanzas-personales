import test from 'node:test';
import assert from 'node:assert/strict';
import { updateCategory, deleteCategory, CategoryInputError } from '../src/lib/categories.mjs';

const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const valid = { name: 'Comida', kind: 'expense', icon: 'food' };
test('category edits reject invalid ids, names, types and icons before accessing the pool', async () => {
  const pool = { getConnection: async () => assert.fail('Unexpected database access'), execute: async () => assert.fail('Unexpected database access') };
  for (const input of [{ ...valid, name: '' }, { ...valid, name: 'a'.repeat(81) }, { ...valid, kind: 'transfer' }, { ...valid, icon: 'url' }]) await assert.rejects(updateCategory(pool, 'owner', id, input), CategoryInputError);
  await assert.rejects(updateCategory(pool, 'owner', 'invalid', valid), CategoryInputError);
  await assert.rejects(deleteCategory(pool, 'owner', 'invalid'), CategoryInputError);
});

test('changing a used category type rolls back before any financial or category write', async () => {
  for (const linkedTable of ['movements', 'budgets', 'scheduled_payments']) {
    const events = [];
    const connection = {
      beginTransaction: async () => events.push('begin'), commit: async () => events.push('commit'), rollback: async () => events.push('rollback'), release: () => events.push('release'),
      execute: async (sql, params) => {
        assert.deepEqual(params, ['owner', id]);
        assert.ok(!sql.startsWith('UPDATE'));
        if (sql.includes('FROM categories')) { assert.match(sql, /FOR UPDATE/); return [[{ id, kind: 'expense' }]]; }
        return [sql.includes(`FROM ${linkedTable} `) ? [{ id: 'linked' }] : []];
      },
    };
    await assert.rejects(updateCategory({ getConnection: async () => connection }, 'owner', id, { ...valid, kind: 'income' }), /conserva su tipo/);
    assert.deepEqual(events, ['begin', 'rollback', 'release']);
  }
});

test('category deletion is owner scoped and preserves referential constraints', async () => {
  let parameters;
  await deleteCategory({ execute: async (sql, params) => { assert.match(sql, /WHERE user_id = \? AND id = \?/); parameters = params; return [{ affectedRows: 1 }]; } }, 'owner', id);
  assert.deepEqual(parameters, ['owner', id]);
  await assert.rejects(deleteCategory({ execute: async () => [{ affectedRows: 0 }] }, 'other', id), /no está disponible/);
  await assert.rejects(deleteCategory({ execute: async () => { throw Object.assign(new Error(), { code: 'ER_ROW_IS_REFERENCED_2' }); } }, 'owner', id), /historial/);
});
