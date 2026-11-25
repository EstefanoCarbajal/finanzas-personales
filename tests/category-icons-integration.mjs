import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createCategory, saveCategoryIcon, updateCategory } from '../src/lib/categories.mjs';
import { categoryIcons } from '../src/lib/category-icons.mjs';
import { readDashboard } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: category icons persist, preserve financial fields and isolate owners', async () => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  try {
    for (const id of users) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, `category-${id}@example.invalid`, 'not-a-login-hash']);
    await createCategory(pool, users[0], { name: 'Mascotas QA', kind: 'expense', icon: 'pet', color: 'blue' });
    let data = await readDashboard(pool, users[0]);
    const category = data.categories[0];
    assert.equal(category.icon, 'pet');
    assert.equal(category.color, 'blue');
    await saveCategoryIcon(pool, users[0], category.id, 'heart');
    await saveCategoryIcon(pool, users[0], category.id, 'heart'); // Saving an unchanged icon succeeds.
    await assert.rejects(saveCategoryIcon(pool, users[1], category.id, 'food'));
    await assert.rejects(saveCategoryIcon(pool, users[0], category.id, 'invalid'));
    await assert.rejects(createCategory(pool, users[0], { name: 'Mascotas QA', kind: 'expense', icon: 'food' }));
    await assert.rejects(pool.execute('UPDATE categories SET icon = ? WHERE user_id = ? AND id = ?', ['invalid', users[0], category.id]));
    data = await readDashboard(pool, users[0]);
    assert.deepEqual(data.categories[0], { ...category, icon: 'heart' });
    const edit = { name: category.name, kind: category.kind, icon: 'heart' };
    await assert.rejects(updateCategory(pool, users[1], category.id, { ...edit, color: 'pink' }));
    await updateCategory(pool, users[0], category.id, { ...edit, color: 'violet' });
    await updateCategory(pool, users[0], category.id, edit);
    assert.equal((await readDashboard(pool, users[0])).categories[0].color, 'violet');
    await assert.rejects(pool.execute('UPDATE categories SET color = ? WHERE user_id = ? AND id = ?', ['invalid', users[0], category.id]));
    await updateCategory(pool, users[0], category.id, { ...edit, color: 'auto' });
    assert.equal((await readDashboard(pool, users[0])).categories[0].color, null);
    assert.equal(data.totals.balance, '0.00');
    assert.equal(data.movements.length, 0);
    assert.equal((await readDashboard(pool, users[1])).categories.length, 0);
    const legacyId = randomUUID();
    await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [legacyId, users[0], 'Legacy QA', 'income']);
    assert.equal((await readDashboard(pool, users[0])).categories.find(item => item.id === legacyId).icon, null);
    const addedIcons = categoryIcons.filter(item => ['fuel', 'utilities', 'tech', 'music', 'sports', 'insurance', 'subscriptions', 'taxes'].includes(item.id));
    for (const { id, tone, label } of addedIcons) {
      await createCategory(pool, users[0], { name: label, kind: 'expense', icon: id, color: tone });
    }
    const { categories } = await readDashboard(pool, users[0]);
    for (const { id, tone, label } of addedIcons) {
      const added = categories.find(item => item.name === label);
      assert.equal(added?.icon, id);
      assert.equal(added?.color, tone);
    }
    await updateCategory(pool, users[0], category.id, { ...edit, icon: 'subscriptions', color: 'teal' });
    const updated = (await readDashboard(pool, users[0])).categories.find(item => item.id === category.id);
    assert.equal(updated?.icon, 'subscriptions');
    assert.equal(updated?.color, 'teal');
  } finally {
    for (const user of users) { await pool.execute('DELETE FROM categories WHERE user_id = ?', [user]); await pool.execute('DELETE FROM users WHERE id = ?', [user]); }
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', users);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
