import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { hashPassword, tokenHash, verifyPassword } from '../src/lib/password.mjs';
import { updateCredentials } from '../src/lib/settings.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DB_NAME !== 'u519053982_finanzas_test' || process.env.TEST_DB_NAME !== process.env.DB_NAME || process.env.DB_SSL !== 'true') throw new Error('Usar únicamente la base exclusiva de pruebas con TLS.');

test('MySQL: credential changes verify ownership, throttle failures and revoke sessions atomically', async () => {
  const pool = createDatabasePool();
  const owners = [randomUUID(), randomUUID()];
  const emails = owners.map(id => `settings-${id}@example.invalid`);
  const password = randomBytes(24).toString('hex');
  const newPassword = randomBytes(24).toString('hex');
  const tokens = Array.from({ length: 4 }, () => randomBytes(32).toString('hex'));
  const bucket = tokenHash(`settings:${owners[0]}`);
  const createSession = async (index, owner) => pool.execute('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 DAY))', [tokenHash(tokens[index]), owner]);
  try {
    for (let i = 0; i < owners.length; i++) await pool.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [owners[i], emails[i], await hashPassword(password)]);
    await createSession(0, owners[0]); await createSession(1, owners[0]); await createSession(2, owners[1]);
    const input = { kind: 'email', email: `changed-${owners[0]}@example.invalid`, currentPassword: password };
    await assert.rejects(updateCredentials(pool, owners[0], tokens[2], input), /sesión/);
    await assert.rejects(updateCredentials(pool, owners[0], tokens[0], { ...input, currentPassword: 'wrong' }), /actual/);
    await assert.rejects(updateCredentials(pool, owners[0], tokens[0], { ...input, email: emails[1] }), /correo/);
    const [[before]] = await pool.execute('SELECT email FROM users WHERE id = ?', [owners[0]]);
    assert.equal(before.email, emails[0]);
    const [[sessions]] = await pool.execute('SELECT COUNT(*) AS total FROM sessions WHERE user_id = ?', [owners[0]]);
    assert.equal(Number(sessions.total), 2);
    await updateCredentials(pool, owners[0], tokens[0], input);
    const [[updated]] = await pool.execute('SELECT email FROM users WHERE id = ?', [owners[0]]);
    assert.equal(updated.email, input.email);
    const [[revoked]] = await pool.execute('SELECT COUNT(*) AS total FROM sessions WHERE user_id = ?', [owners[0]]);
    assert.equal(Number(revoked.total), 0);
    await assert.rejects(updateCredentials(pool, owners[0], tokens[0], input), /sesión/);
    await createSession(3, owners[0]);
    await updateCredentials(pool, owners[0], tokens[3], { kind: 'password', currentPassword: password, password: newPassword, confirmPassword: newPassword });
    const [[changed]] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [owners[0]]);
    assert.equal(await verifyPassword(newPassword, changed.password_hash), true);
    assert.equal(await verifyPassword(password, changed.password_hash), false);
    const [[other]] = await pool.execute('SELECT email, password_hash FROM users WHERE id = ?', [owners[1]]);
    assert.equal(other.email, emails[1]);
    assert.equal(await verifyPassword(password, other.password_hash), true);
    const [[otherSession]] = await pool.execute('SELECT COUNT(*) AS total FROM sessions WHERE user_id = ?', [owners[1]]);
    assert.equal(Number(otherSession.total), 1);
    await pool.execute('UPDATE login_limits SET attempts = 8 WHERE bucket = ?', [bucket]);
    await assert.rejects(updateCredentials(pool, owners[0], tokens[3], input), /15 minutos/);
  } finally {
    for (const id of owners) await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    await pool.execute('DELETE FROM login_limits WHERE bucket = ?', [bucket]);
    const [[remaining]] = await pool.execute('SELECT COUNT(*) AS total FROM users WHERE id IN (?, ?)', owners);
    assert.equal(Number(remaining.total), 0);
    await pool.end();
  }
});
