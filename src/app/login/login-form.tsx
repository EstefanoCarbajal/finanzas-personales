'use client';

import { useActionState } from 'react';
import { signIn } from './actions';
import styles from './login.module.css';

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signIn, { message: '' });
  return <form action={action} className={styles.form}>
    <label><span>Correo electrónico</span><input className={styles.input} name="email" type="email" autoComplete="username" placeholder="tu@email.com" required maxLength={254} disabled={!enabled} /></label>
    <label><span>Contraseña</span><input className={styles.input} name="password" type="password" autoComplete="current-password" placeholder="••••••••" required maxLength={128} disabled={!enabled} /></label>
    <p className={styles.status} role="status">{state.message}</p>
    <button className={styles.submit} disabled={!enabled || pending}>{pending ? 'Entrando…' : <>Iniciar sesión <span aria-hidden="true">→</span></>}</button>
  </form>;
}
