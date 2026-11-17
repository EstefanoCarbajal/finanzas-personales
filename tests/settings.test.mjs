import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSettings, updateCredentials } from '../src/lib/settings.mjs';
import { hashPassword } from '../src/lib/password.mjs';

const input = { kind: 'email', email: ' Nuevo@Example.com ', currentPassword: 'correct-password-123' };
test('settings normalize email and reject invalid credentials before connecting', async () => {
  assert.equal(validateSettings(input).email, 'nuevo@example.com');
  for (const value of [null, { ...input, kind: 'other' }, { ...input, email: 'bad' }, { ...input, currentPassword: '' }, { kind: 'password', currentPassword: 'old', password: 'short' }, { kind: 'password', currentPassword: 'old', password: 'new-password-123', confirmPassword: 'different' }]) {
    await assert.rejects(updateCredentials({ getConnection() { throw new Error('Unexpected connection'); } }, 'owner', 'token', value), error => error.name !== 'AssertionError' && !error.message.includes('Unexpected'));
  }
});

test('settings require current password, live owner session and persistent attempt allowance', async () => {
  const hash = await hashPassword(input.currentPassword);
  for (const scenario of ['wrong-password', 'revoked-session', 'rate-limit', 'success', 'duplicate']) {
    const calls = [];
    const connection = {
      beginTransaction: async () => calls.push(['begin']), commit: async () => calls.push(['commit']), rollback: async () => calls.push(['rollback']), release: () => calls.push(['release']),
      execute: async (sql, values) => {
        calls.push([sql, values]);
        if (sql.startsWith('SELECT attempts')) return [[{ attempts: scenario === 'rate-limit' ? 8 : 0, expired: 0 }]];
        if (sql.startsWith('SELECT email')) return [[{ email: 'old@example.com', password_hash: hash }]];
        if (sql.startsWith('SELECT token_hash')) return [scenario === 'revoked-session' ? [] : [{ token_hash: 'live' }]];
        if (sql.startsWith('UPDATE users') && scenario === 'duplicate') throw Object.assign(new Error(), { code: 'ER_DUP_ENTRY' });
        return [[]];
      },
    };
    const operation = updateCredentials({ getConnection: async () => connection }, 'owner', 'token', { ...input, currentPassword: scenario === 'wrong-password' ? 'wrong' : input.currentPassword });
    if (scenario === 'success') await operation; else await assert.rejects(operation);
    const deletions = calls.filter(([sql]) => sql.startsWith('DELETE FROM sessions'));
    assert.equal(deletions.length, scenario === 'success' ? 1 : 0);
    if (deletions.length) assert.deepEqual(deletions[0][1], ['owner']);
    if (scenario !== 'rate-limit') assert.ok(calls.findIndex(([sql]) => sql === 'commit') < calls.findIndex(([sql]) => sql.startsWith('SELECT email')));
    for (const [sql, values] of calls.filter(([sql]) => /^(SELECT email|SELECT token_hash|UPDATE users)/.test(sql))) assert.ok(values.includes('owner'), sql);
    assert.equal(calls.at(-1)[0], 'release');
  }
});
