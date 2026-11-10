'use client';

import { useActionState } from 'react';
import { signIn } from './actions';

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signIn, { message: '' });
  return <form action={action} className="private-form">
    <label>Correo electrónico<input name="email" type="email" autoComplete="username" required maxLength={254} disabled={!enabled} /></label>
    <label>Contraseña<input name="password" type="password" autoComplete="current-password" required maxLength={128} disabled={!enabled} /></label>
    <p role="status">{state.message}</p>
    <button className="primary" disabled={!enabled || pending}>{pending ? 'Entrando…' : 'Iniciar sesión'}</button>
  </form>;
}
