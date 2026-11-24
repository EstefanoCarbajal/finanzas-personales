import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryColors, categoryToneFor, categoryIcons, categoryIconFor, validCategoryIcon } from '../src/lib/category-icons.mjs';
import { createCategory, saveCategoryIcon, updateCategory } from '../src/lib/categories.mjs';

test('category icons support legacy names, explicit overrides and safe fallbacks', () => {
  assert.equal(new Set(categoryIcons.map(icon => icon.id)).size, 16);
  assert.equal(categoryIconFor({ name: 'Alimentación', icon: null }), 'food');
  assert.equal(categoryIconFor({ name: 'Educación' }), 'education');
  assert.equal(categoryIconFor({ name: 'Transporte', icon: 'pet' }), 'pet');
  assert.equal(categoryIconFor({ name: 'Personalizada', icon: 'invalid' }), 'tag');
  for (const value of ['', '<svg>', '__proto__', null, {}, 'FOOD']) assert.equal(validCategoryIcon(value), false);
});

test('category creation validates icon, type and name before writing', async () => {
  let calls = 0;
  const pool = { execute: async () => { calls++; return [{}]; } };
  for (const input of [{ name: 'Viajes', kind: 'transfer', icon: 'travel' }, { name: '', kind: 'income', icon: 'tag' }, { name: 'Viajes', kind: 'expense', icon: 'html' }]) await assert.rejects(createCategory(pool, 'owner', input));
  assert.equal(calls, 0);
});

test('an explicit palette color overrides the icon tone and automatic restores it', async () => {
  for (const { id } of categoryColors) assert.equal(categoryToneFor({ icon: 'food', color: id }), id);
  for (const color of [undefined, null, 'auto', 'invalid']) assert.equal(categoryToneFor({ name: 'Transporte', color }), 'blue');
  const input = { name: 'Mascotas', icon: 'pet', kind: 'expense', color: '#ff0000' };
  await assert.rejects(createCategory({}, 'owner', input), /paleta/);
  await assert.rejects(updateCategory({}, 'owner', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', input), /paleta/);
});

test('category icon edits are owner scoped and reject unavailable categories', async () => {
  const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  let parameters;
  const pool = { execute: async (sql, params) => { assert.match(sql, /WHERE user_id = \? AND id = \?/); parameters = params; return [{ affectedRows: 1 }]; } };
  await saveCategoryIcon(pool, 'owner', id, 'pet');
  assert.deepEqual(parameters, ['pet', 'owner', id]);
  await assert.rejects(saveCategoryIcon(pool, 'owner', id, 'url'));
  await assert.rejects(saveCategoryIcon({ execute: async () => [{ affectedRows: 0 }] }, 'owner', id, 'pet'));
});
