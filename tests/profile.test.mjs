import test from 'node:test';
import assert from 'node:assert/strict';
import { avatars, validAvatar } from '../src/lib/avatars.mjs';
import { readAvatar, saveAvatar } from '../src/lib/profile.mjs';

test('avatar catalog only accepts known identifiers', () => {
  assert.equal(new Set(avatars.map(a => a.id)).size, 6);
  for (const avatar of avatars) assert.equal(validAvatar(avatar.id), true);
  for (const value of [null, undefined, '', 'KOALA', '<script>', '../fox', { id: 'koala' }]) assert.equal(validAvatar(value), false);
});

test('profile rejects invalid choices before writing and scopes reads/writes to the supplied owner', async () => {
  const calls = [];
  const pool = { execute: async (sql, values) => { calls.push({ sql, values }); return [[], []]; } };
  await assert.rejects(saveAvatar(pool, 'owner-a', 'bad-avatar'));
  assert.equal(calls.length, 0);
  assert.equal(await readAvatar(pool, 'owner-b'), 'koala');
  assert.match(calls[0].sql, /WHERE user_id = \?/);
  assert.deepEqual(calls[0].values, ['owner-b']);
  await saveAvatar(pool, 'owner-a', 'rabbit');
  assert.deepEqual(calls[1].values, ['owner-a', 'rabbit', 'rabbit']);
});
