import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createManagedUser, isUserAdmin } from '../src/lib/user-management.mjs';
import { hashPassword, tokenHash, verifyPassword } from '../src/lib/password.mjs';
import { login, sessionUser, revokeSession, readDashboard, saveMovement } from '../src/lib/repository.mjs';
import { readPlanning } from '../src/lib/planning.mjs';
import { readGoals } from '../src/lib/goals.mjs';
import { readAvatar } from '../src/lib/profile.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva TLS de pruebas requerida.');
test('usuarios privados: permisos, acceso e aislamiento', async t => {
  const pool = createDatabasePool(); const admin = randomUUID(); const users = [admin]; const token = randomBytes(32).toString('hex');
  const emails = Array.from({ length: 3 }, () => 'new-user-' + randomUUID() + '@example.invalid');
  const password = 'Ficticia-pruebas-12345'; const bucket = tokenHash('create-user:' + admin);
  const input = { email: emails[0], password, confirmPassword: password, currentPassword: password, user_id: admin, is_admin: true };
  try {
    await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [admin, emails[2], await hashPassword(password)]);
    await pool.execute('INSERT INTO user_admins (user_id) VALUES (?)', [admin]);
    await pool.execute('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY))', [tokenHash(token), admin]);
    await t.test('solo admin con sesión válida y contraseña actual', async () => {
      await assert.rejects(createManagedUser(pool, admin, 'invalido', input), /permiso/);
      await assert.rejects(createManagedUser(pool, admin, token, { ...input, currentPassword: 'incorrecta' }), /contraseña actual/);
      const [[limit]] = await pool.execute('SELECT attempts FROM login_limits WHERE bucket = ?', [bucket]); assert.equal(Number(limit.attempts), 2);
      await createManagedUser(pool, admin, token, input);
      const [[created]] = await pool.execute('SELECT id, password_hash FROM users WHERE email = ?', [emails[0]]); users.push(created.id);
      assert.equal(await verifyPassword(password, created.password_hash), true); assert.notEqual(created.password_hash, password);
      assert.equal(await isUserAdmin(pool, created.id), false);
      const newToken = await login(pool, emails[0], password); assert.ok(newToken); assert.equal((await sessionUser(pool, newToken)).id, created.id);
      await assert.rejects(createManagedUser(pool, created.id, newToken, { ...input, email: emails[1] }), /administrador/);
      const dashboard = await readDashboard(pool, created.id); assert.equal(dashboard.accounts.length, 0); assert.equal(dashboard.categories.length, 7); assert.equal(dashboard.movements.length, 0);
      const ownAccount = randomUUID();
      await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [ownAccount, created.id, 'Cuenta creada por QA']);
      assert.equal((await readDashboard(pool, created.id)).accounts[0].opening_balance, '0.00');
      assert.equal((await readPlanning(pool, created.id, '2026-11')).budgets.length, 0); assert.equal((await readGoals(pool, created.id)).length, 0);
      assert.equal((await readDashboard(pool, admin)).accounts.length, 0);
      const account = randomUUID(); const category = randomUUID();
      await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [account, admin, 'QA admin']);
      await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [category, admin, 'QA admin', 'income']);
      await assert.rejects(saveMovement(pool, created.id, { request_id: randomUUID(), kind: 'income', amount: '1.00', account_id: account, category_id: category, description: 'Intento aislado', occurred_on: '2026-01-01' }));
      await saveMovement(pool, created.id, { request_id: randomUUID(), kind: 'income', amount: '25.10', account_id: ownAccount, category_id: dashboard.categories.find(category => category.kind === 'income').id, description: 'Propio QA', occurred_on: '2026-01-01' });
      assert.equal((await readDashboard(pool, admin)).movements.length, 0); assert.equal((await readDashboard(pool, created.id)).movements.length, 1);
      await revokeSession(pool, newToken); assert.equal(await sessionUser(pool, newToken), null);
    });
    await t.test('correo único, reenvíos concurrentes y límite persistente', async () => {
      await assert.rejects(createManagedUser(pool, admin, token, { ...input, email: emails[0].toUpperCase() }), /existe/);
      const outcomes = await Promise.allSettled([createManagedUser(pool, admin, token, { ...input, email: emails[1] }), createManagedUser(pool, admin, token, { ...input, email: emails[1] })]);
      assert.equal(outcomes.filter(outcome => outcome.status === 'fulfilled').length, 1);
      const [[created]] = await pool.execute('SELECT id FROM users WHERE email = ?', [emails[1]]); users.push(created.id);
      await pool.execute('UPDATE login_limits SET attempts = 8 WHERE bucket = ?', [bucket]);
      await assert.rejects(createManagedUser(pool, admin, token, input), /15 minutos/);
      assert.equal((await sessionUser(pool, token)).id, admin);
    });
  } finally {
    // Locate only this fixture's emails too, so cleanup also covers a failed assertion after insert.
    const [created] = await pool.execute('SELECT id FROM users WHERE email IN (?, ?, ?)', emails);
    for (const id of new Set([...users, ...created.map(user => user.id)])) {
      for (const table of ['user_admins', 'user_preferences', 'movements', 'categories', 'accounts', 'sessions']) await pool.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [id]);
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash('create-user:' + id)]);
    }
    for (const email of emails) await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash('email:' + email)]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE email IN (?, ?, ?)', emails); assert.equal(Number(remaining.total), 0); await pool.end();
  }
});
