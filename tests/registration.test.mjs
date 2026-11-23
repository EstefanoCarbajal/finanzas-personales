import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration } from '../src/lib/registration.mjs';

test('registro valida correo y contraseñas', () => {
  const input = { email: '  NUEVO@example.invalid ', password: 'contraseña-segura-123', confirmPassword: 'contraseña-segura-123' };
  assert.equal(validateRegistration(input).email, 'nuevo@example.invalid');
  assert.throws(() => validateRegistration({ ...input, email: 'incorrecto' }), /correo/);
  assert.throws(() => validateRegistration({ ...input, password: 'corta' }), /12/);
  assert.throws(() => validateRegistration({ ...input, confirmPassword: 'otra' }), /coinciden/);
  assert.throws(() => validateRegistration({ ...input, password: 'a'.repeat(129) }), /128/);
});
