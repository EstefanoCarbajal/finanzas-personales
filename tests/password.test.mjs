import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, tokenHash } from '../src/lib/password.mjs';

test('password hashing uses unique salts and verifies only the right password', async () => {
  const password = 'Solo-para-pruebas-123';
  const a = await hashPassword(password), b = await hashPassword(password);
  assert.notEqual(a, b);
  assert.equal(a.includes(password), false);
  assert.equal(await verifyPassword(password, a), true);
  assert.equal(await verifyPassword('incorrecta', a), false);
  assert.equal(await verifyPassword(password, 'invalid'), false);
  await assert.rejects(() => hashPassword('corta'));
  assert.equal(tokenHash('token').length, 64);
});
