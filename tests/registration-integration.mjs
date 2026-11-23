import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { registerUser } from '../src/lib/registration.mjs';
import { tokenHash, verifyPassword } from '../src/lib/password.mjs';
import { login, sessionUser, revokeSession, readDashboard } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Base exclusiva TLS de pruebas requerida.');

test('registro público crea cuenta aislada y respeta límites', async () => {
  const pool = createDatabasePool();
  const email = `registro-qa-${randomUUID()}@example.invalid`;
  const password = 'Ficticia-registro-12345';
  const input = { email, password, confirmPassword: password, is_admin: true };
  try {
    await Promise.all([registerUser(pool, input), registerUser(pool, { ...input, email: email.toUpperCase() })]);
    const [users] = await pool.execute('SELECT id, password_hash FROM users WHERE email = ?', [email]);
    assert.equal(users.length, 1);
    assert.equal(await verifyPassword(password, users[0].password_hash), true);
    const [[admin]] = await pool.execute('SELECT COUNT(*) AS total FROM user_admins WHERE user_id = ?', [users[0].id]);
    assert.equal(Number(admin.total), 0);
    const dashboard = await readDashboard(pool, users[0].id);
    assert.equal(dashboard.accounts.length, 0); assert.equal(dashboard.categories.length, 7); assert.equal(dashboard.movements.length, 0);
    const token = await login(pool, email, password);
    assert.ok(token); assert.equal((await sessionUser(pool, token)).id, users[0].id);
    await revokeSession(pool, token); assert.equal(await sessionUser(pool, token), null);
    await registerUser(pool, { ...input, password: 'otra-contraseña-123', confirmPassword: 'otra-contraseña-123' });
    const [[after]] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [users[0].id]);
    assert.equal(await verifyPassword(password, after.password_hash), true);
    await registerUser(pool, input); await registerUser(pool, input);
    await assert.rejects(registerUser(pool, input), /15 minutos/);
  } finally {
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    for (const user of users) {
      for (const table of ['sessions', 'categories']) await pool.execute(`DELETE FROM ${table} WHERE user_id = ?`, [user.id]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user.id]);
    }
    await pool.execute('DELETE FROM login_limits WHERE bucket IN (?, ?)', [tokenHash(`registration:email:${email}`), tokenHash(`email:${email}`)]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE email = ?', [email]);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
