import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { hashPassword, tokenHash } from '../src/lib/password.mjs';
import { login, sessionUser, revokeSession, saveMovement, readDashboard } from '../src/lib/repository.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== process.env.TEST_DB_NAME || !process.env.TEST_DB_NAME) {
  throw new Error('Configura TEST_DB_NAME con el nombre exacto de la base exclusiva de pruebas.');
}

test('MySQL: aislamiento, precisión, transferencias, sesiones y límites de acceso', async t => {
  const pool = createDatabasePool();
  const users = [randomUUID(), randomUUID()];
  const accounts = [randomUUID(), randomUUID(), randomUUID()];
  const categories = [randomUUID(), randomUUID(), randomUUID()];
  const emails = users.map(id => `test-${id}@example.invalid`);
  const password = 'Prueba-ficticia-123456';
  let token;
  const base = { kind: 'income', account_id: accounts[0], category_id: categories[0], amount: '100.00', description: 'Prueba automatizada', occurred_on: '2026-01-01' };
  const save = (user, patch = {}) => saveMovement(pool, user, { ...base, request_id: randomUUID(), ...patch });
  try {
    const hash = await hashPassword(password);
    for (let i = 0; i < users.length; i++) {
      await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [users[i], emails[i], hash]);
    }
    for (let i = 0; i < accounts.length; i++) {
      await pool.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [accounts[i], users[i === 2 ? 1 : 0], `Prueba ${i}`]);
    }
    for (let i = 0; i < categories.length; i++) {
      await pool.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [categories[i], users[i === 2 ? 1 : 0], `Prueba ${i}`, i === 1 ? 'expense' : 'income']);
    }

    await t.test('transferencia atómica y céntimos exactos en DECIMAL', async () => {
      await save(users[0]);
      await save(users[0], { kind: 'expense', category_id: categories[1], amount: '10.25' });
      await save(users[0], { kind: 'transfer', category_id: null, destination_id: accounts[1], amount: '25.00' });
      const data = await readDashboard(pool, users[0]);
      assert.equal(data.movements.length, 3);
      assert.deepEqual(data.totals, { income: '100.00', expense: '10.25', balance: '89.75', accounts: { [accounts[0]]: '64.75', [accounts[1]]: '25.00' } });
      assert.deepEqual((await readDashboard(pool, users[1])).movements, []);
      assert.equal((await readDashboard(pool, users[1])).accounts.length, 1);
    });

    await t.test('rechaza cuentas, destinos y categorías de otro usuario', async () => {
      await assert.rejects(save(users[1]));
      await assert.rejects(save(users[0], { category_id: categories[2] }));
      await assert.rejects(save(users[0], { kind: 'transfer', category_id: null, destination_id: accounts[2] }));
      await assert.rejects(save(users[0], { kind: 'expense', category_id: categories[0] }));
      assert.equal((await readDashboard(pool, users[0])).movements.length, 3);
      // Database foreign keys protect ownership even if application validation is bypassed.
      await assert.rejects(pool.execute(`INSERT INTO movements (id,user_id,request_id,kind,account_id,category_id,amount,description,occurred_on)
        VALUES (?, ?, ?, 'income', ?, ?, '1.00', 'FK test', '2026-01-01')`, [randomUUID(), users[1], randomUUID(), accounts[0], categories[2]]), e => e.code === 'ER_NO_REFERENCED_ROW_2');
    });

    await t.test('evita duplicados por reenvío y aplica restricciones de importe', async () => {
      const request_id = randomUUID();
      await save(users[0], { request_id, amount: '0.10' });
      await assert.rejects(save(users[0], { request_id, amount: '0.10' }), /ya fue registrado/);
      await save(users[0], { amount: '0.20' });
      assert.equal((await readDashboard(pool, users[0])).totals.income, '100.30');
      await assert.rejects(pool.execute(`INSERT INTO movements (id,user_id,request_id,kind,account_id,category_id,amount,description,occurred_on)
        VALUES (?, ?, ?, 'income', ?, ?, '-1.00', 'CHECK test', '2026-01-01')`, [randomUUID(), users[0], randomUUID(), accounts[0], categories[0]]));
    });

    await t.test('sesiones opacas: contraseña, expiración y revocación', async () => {
      assert.equal(await login(pool, emails[0], 'incorrecta'), null);
      assert.equal(await sessionUser(pool, 'token-inválido'), null);
      token = await login(pool, emails[0], password);
      assert.ok(token);
      assert.equal((await sessionUser(pool, token)).id, users[0]);
      const [[stored]] = await pool.execute('SELECT token_hash FROM sessions WHERE user_id = ?', [users[0]]);
      assert.notEqual(stored.token_hash, token);
      assert.equal(stored.token_hash, tokenHash(token));
      await pool.execute('UPDATE sessions SET expires_at = DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 SECOND) WHERE token_hash = ?', [tokenHash(token)]);
      assert.equal(await sessionUser(pool, token), null);
      token = await login(pool, emails[0], password);
      await revokeSession(pool, token);
      assert.equal(await sessionUser(pool, token), null);
    });

    await t.test('limita intentos aunque cambie el proceso de aplicación', async () => {
      for (let i = 0; i < 8; i++) assert.equal(await login(pool, emails[1], 'incorrecta'), null);
      assert.equal(await login(pool, emails[1], password), null);
      const [[limit]] = await pool.execute('SELECT attempts FROM login_limits WHERE bucket = ?', [tokenHash(`email:${emails[1]}`)]);
      assert.equal(limit.attempts, 8);
    });
  } finally {
    // Only delete the random fixtures created by this run, never existing application data.
    for (const user of users) {
      await pool.execute('DELETE FROM movements WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM sessions WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM categories WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM accounts WHERE user_id = ?', [user]);
      await pool.execute('DELETE FROM users WHERE id = ?', [user]);
    }
    for (const email of emails) await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash(`email:${email}`)]);
    await pool.end();
  }
});
