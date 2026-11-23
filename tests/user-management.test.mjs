import test from 'node:test';
import assert from 'node:assert/strict';
import { validateNewUser } from '../src/lib/user-management.mjs';
test('alta privada: normaliza correo y valida contraseñas', () => {
  const base = { email: '  Persona@Example.invalid ', password: 'Password-ficticio-123', confirmPassword: 'Password-ficticio-123', currentPassword: 'Actual-ficticio-123' };
  assert.equal(validateNewUser(base).email, 'persona@example.invalid');
  for (const patch of [{ email: 'no-correo' }, { email: 'a'.repeat(255) }, { password: 'corta' }, { password: 'a'.repeat(129) }, { confirmPassword: 'diferente' }, { currentPassword: '' }]) assert.throws(() => validateNewUser({ ...base, ...patch }));
});


test('editar usuario admite conservar contraseña y valida correo/confirmación', async () => {
  const { validateUserEdit } = await import('../src/lib/user-management.mjs');
  const base = { email: '  Otra@Example.invalid ', password: '', confirmPassword: '', currentPassword: 'Actual-ficticio-123' };
  assert.equal(validateUserEdit(base).email, 'otra@example.invalid');
  assert.equal(validateUserEdit(base).password, '');
  for (const patch of [{ email: 'no' }, { currentPassword: '' }, { password: 'corta', confirmPassword: 'corta' }, { password: 'Nueva-ficticia-123', confirmPassword: '' }]) assert.throws(() => validateUserEdit({ ...base, ...patch }));
});
