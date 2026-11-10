import assert from 'node:assert/strict';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const origin = 'http://127.0.0.1:3000';
const decode = text => text.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
function actionForm(html) {
  const form = new FormData();
  for (const tag of html.matchAll(/<input\b[^>]*>/g)) {
    const name = tag[0].match(/\bname="([^"]*)"/);
    if (name?.[1].startsWith('$ACTION_')) {
      form.set(decode(name[1]), decode(tag[0].match(/\bvalue="([^"]*)"/)?.[1] || ''));
    }
  }
  assert.ok([...form.keys()].length, 'No se encontró el formulario de acceso.');
  return form;
}
assert.ok(process.env.INITIAL_USER_EMAIL && process.env.INITIAL_USER_PASSWORD, 'Faltan los datos privados de la cuenta inicial.');
const unauthorized = await fetch(`${origin}/privado`, { redirect: 'manual' });
assert.equal(unauthorized.status, 307);
assert.equal(unauthorized.headers.get('location'), '/login');
const html = await (await fetch(`${origin}/login`)).text();
const form = actionForm(html);
form.set('email', process.env.INITIAL_USER_EMAIL);
form.set('password', process.env.INITIAL_USER_PASSWORD);
const response = await fetch(`${origin}/login`, { method: 'POST', headers: { Origin: origin }, body: form, redirect: 'manual' });
assert.equal(response.status, 303, 'El formulario no inició la sesión.');
const cookieHeader = response.headers.getSetCookie().find(value => value.startsWith('finanzas_session='));
assert.ok(cookieHeader?.includes('HttpOnly'));
assert.match(cookieHeader, /SameSite=lax/i);
const cookie = cookieHeader.split(';')[0];
try {
  const privatePage = await fetch(`${origin}/privado`, { headers: { Cookie: cookie } });
  assert.equal(privatePage.status, 200);
  const content = await privatePage.text();
  assert.ok(content.includes('Tus cuentas') && content.includes('Movimientos guardados'));
  const logout = actionForm(content.split('</form>')[0]);
  const closed = await fetch(`${origin}/privado`, { method: 'POST', headers: { Origin: origin, Cookie: cookie }, body: logout, redirect: 'manual' });
  assert.equal(closed.status, 303);
  const revoked = await fetch(`${origin}/privado`, { headers: { Cookie: cookie }, redirect: 'manual' });
  assert.equal(revoked.status, 307);
  assert.equal(revoked.headers.get('location'), '/login');
  console.log('Acceso HTTP verificado: bloqueo anónimo, login, cookie HttpOnly, panel privado y cierre de sesión.');
} finally {
  // Revoke even if an assertion interrupted the HTTP logout path.
  const { createDatabasePool } = await import('../src/lib/database.mjs');
  const { revokeSession } = await import('../src/lib/repository.mjs');
  const pool = createDatabasePool();
  try { await revokeSession(pool, cookie.split('=')[1]); } finally { await pool.end(); }
}
