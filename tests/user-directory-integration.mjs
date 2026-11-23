import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { createManagedUser, readManagedUsers, managePrivateUser } from '../src/lib/user-management.mjs';
import { hashPassword, tokenHash } from '../src/lib/password.mjs';
import { login, sessionUser, readDashboard } from '../src/lib/repository.mjs';
import { createGoal, contributeToGoal, readGoals } from '../src/lib/goals.mjs';
import { saveBudget, schedulePayment } from '../src/lib/planning.mjs';
import { createPiggybank } from '../src/lib/piggybanks.mjs';
nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva de pruebas TLS requerida.');
test('directorio: autorización, edición y borrado completo aislado', async t => {
  const pool = createDatabasePool(); const admin = randomUUID(); const token = randomBytes(32).toString('hex'); const ids = [admin];
  const emails = Array.from({ length: 4 }, () => 'directory-' + randomUUID() + '@example.invalid');
  const password = 'Ficticia-pruebas-12345'; const newPassword = 'Otra-ficticia-12345';
  const bucket = tokenHash('create-user:' + admin);
  const tables = ['account_piggybanks','piggybank_requests','reward_redemptions','personal_rewards','habit_completions','habits','budgets','scheduled_payments','goal_contributions','goals','movements','user_preferences','categories','accounts','sessions'];
  const resetLimit = () => pool.execute('DELETE FROM login_limits WHERE bucket = ?', [bucket]);
  try {
    await pool.execute('INSERT INTO users (id,email,password_hash) VALUES (?,?,?)', [admin, emails[0], await hashPassword(password)]);
    await pool.execute('INSERT INTO user_admins (user_id) VALUES (?)', [admin]);
    await pool.execute('INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY))', [tokenHash(token), admin]);
    for (const email of emails.slice(1,3)) { await createManagedUser(pool, admin, token, { email, password, confirmPassword: password, currentPassword: password }); const [[user]] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]); ids.push(user.id); }
    const target = ids[1], other = ids[2]; let targetToken = await login(pool, emails[1], password);
    const baseline = await readDashboard(pool, other);
    await t.test('lista sin secretos, permisos y protección del administrador', async () => {
      const rows = await readManagedUsers(pool, admin);
      assert.ok(rows.some(row => row.id === target)); assert.ok(rows.every(row => Object.keys(row).sort().join(',') === 'created_at,email,id,isAdmin'));
      await assert.rejects(readManagedUsers(pool, target), /administrador/);
      await assert.rejects(managePrivateUser(pool, target, targetToken, other, 'delete', { currentPassword: password, confirmEmail: emails[2] }), /administrador/);
      await assert.rejects(managePrivateUser(pool, admin, 'invalido', target, 'delete', { currentPassword: password, confirmEmail: emails[1] }), /permiso/);
      await assert.rejects(managePrivateUser(pool, admin, token, admin, 'delete', { currentPassword: password, confirmEmail: emails[0] }), /protegida/);
      await resetLimit();
    });
    await t.test('edición revoca sesiones, conserva datos y valida duplicados', async () => {
      const input = { email: emails[3].toUpperCase(), password: '', confirmPassword: '', currentPassword: password };
      await assert.rejects(managePrivateUser(pool, admin, token, target, 'edit', { ...input, currentPassword: 'incorrecta' }), /contraseña actual/);
      await assert.rejects(managePrivateUser(pool, admin, token, target, 'edit', { ...input, email: emails[2] }), /existe/);
      assert.ok(await sessionUser(pool, targetToken));
      await managePrivateUser(pool, admin, token, target, 'edit', input);
      assert.equal(await sessionUser(pool, targetToken), null);
      assert.equal(await login(pool, emails[1], password), null);
      targetToken = await login(pool, emails[3], password); assert.ok(targetToken);
      await managePrivateUser(pool, admin, token, target, 'edit', { ...input, password: newPassword, confirmPassword: newPassword });
      assert.equal(await sessionUser(pool, targetToken), null);
      assert.equal(await login(pool, emails[3], password), null);
      targetToken = await login(pool, emails[3], newPassword); assert.ok(targetToken);
      assert.equal((await readDashboard(pool, target)).accounts.length, 0);
      assert.deepEqual(await readDashboard(pool, other), baseline);
      await resetLimit();
    });
    await t.test('borrado confirmado limpia módulos y no toca al otro usuario', async () => {
      const account = randomUUID(), destination = randomUUID();
      for (const id of [account, destination]) await pool.execute('INSERT INTO accounts (id,user_id,name) VALUES (?,?,?)', [id,target,id]);
      const data = await readDashboard(pool, target); const category = data.categories.find(category => category.kind === 'expense').id;
      await pool.execute('UPDATE accounts SET opening_balance = ? WHERE user_id = ? AND id = ?', ['100.00', target, account]);
      await saveBudget(pool, target, { category_id: category, month: '2099-01', amount: '50.00' });
      await schedulePayment(pool, target, { account_id: account, category_id: category, description: 'QA pago', amount: '10.00', due_on: '2099-01-01' });
      await createGoal(pool, target, { account_id: destination, name: 'QA meta', target_amount: '50.00' });
      const goal = (await readGoals(pool, target))[0]; await contributeToGoal(pool, target, { goal_id: goal.id, account_id: account, amount: '10.00', request_id: randomUUID() });
      await createPiggybank(pool, target, { id: randomUUID(), account_id: account, name: 'QA alcancía', amount: '5.00' });
      const habit = randomUUID(), reward = randomUUID();
      await pool.execute('INSERT INTO habits (id,user_id,name) VALUES (?,?,?)', [habit,target,'QA hábito']);
      await pool.execute('INSERT INTO habit_completions (id,user_id,habit_id,completed_on) VALUES (?,?,?,?)', [randomUUID(),target,habit,'2026-01-01']);
      await pool.execute('INSERT INTO personal_rewards (id,user_id,name,cost_points) VALUES (?,?,?,?)', [reward,target,'QA premio',10]);
      await pool.execute('INSERT INTO reward_redemptions (id,user_id,reward_id,week_key,cost_points,redeemed_on) VALUES (?,?,?,?,?,?)', [randomUUID(),target,reward,'2026-W01',10,'2026-01-01']);
      await pool.execute('INSERT INTO user_preferences (user_id,avatar_id) VALUES (?,?)', [target,'fox']);
      const snapshot = await readDashboard(pool, target);
      await assert.rejects(managePrivateUser(pool, admin, token, target, 'delete', { currentPassword: password, confirmEmail: 'incorrecto@example.invalid' }), /exactamente/);
      assert.deepEqual(await readDashboard(pool,target), snapshot);
      await managePrivateUser(pool, admin, token, target, 'delete', { currentPassword: password, confirmEmail: emails[3] });
      assert.equal(await sessionUser(pool,targetToken), null); assert.equal(await login(pool,emails[3],newPassword), null);
      for (const table of tables) { const [[row]] = await pool.execute('SELECT COUNT(*) AS total FROM ' + table + ' WHERE user_id = ?', [target]); assert.equal(Number(row.total),0,table); }
      const [[deleted]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id = ?', [target]); assert.equal(Number(deleted.total),0);
      assert.deepEqual(await readDashboard(pool,other),baseline); assert.equal((await sessionUser(pool,token)).id,admin);
      await assert.rejects(managePrivateUser(pool,admin,token,target,'delete',{ currentPassword:password,confirmEmail:emails[3] }), /disponible/);
      await pool.execute('UPDATE login_limits SET attempts = 8 WHERE bucket = ?', [bucket]);
      await assert.rejects(managePrivateUser(pool,admin,token,other,'delete',{ currentPassword:password,confirmEmail:emails[2] }), /15 minutos/);
    });
  } finally {
    for (const id of ids) { await pool.execute('DELETE FROM user_admins WHERE user_id = ?', [id]); for (const table of tables) await pool.execute('DELETE FROM ' + table + ' WHERE user_id = ?', [id]); await pool.execute('DELETE FROM users WHERE id = ?', [id]); await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash('create-user:' + id)]); }
    for (const email of emails) await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash('email:' + email)]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?,?,?)',ids); assert.equal(Number(remaining.total),0); await pool.end();
  }
});
