'use client';

import { useActionState, useState } from 'react';
import { signIn, signUp } from './actions';
import styles from './login.module.css';

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signIn, { message: '' });
  const [registration, register, registering] = useActionState(signUp, { message: '', success: false });
  const [creating, setCreating] = useState(false);
  return <>
    {creating ? <form action={register} className={styles.form}>
      <label><span>Correo electrónico</span><input className={styles.input} name="email" type="email" autoComplete="email" placeholder="tu@email.com" required maxLength={254} disabled={!enabled || registering} /></label>
      <label><span>Contraseña · mínimo 12 caracteres</span><input className={styles.input} name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={!enabled || registering} /></label>
      <label><span>Repite tu contraseña</span><input className={styles.input} name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={!enabled || registering} /></label>
      <p className={styles.status} role="status">{registration.message}</p>
      <button className={styles.submit} disabled={!enabled || registering}>{registering ? 'Creando cuenta…' : <>Crear cuenta <span aria-hidden="true">→</span></>}</button>
    </form> : <form action={action} className={styles.form}>
      <label><span>Correo electrónico</span><input className={styles.input} name="email" type="email" autoComplete="username" placeholder="tu@email.com" required maxLength={254} disabled={!enabled || pending} /></label>
      <label><span>Contraseña</span><input className={styles.input} name="password" type="password" autoComplete="current-password" placeholder="••••••••" required maxLength={128} disabled={!enabled || pending} /></label>
      <p className={styles.status} role="status">{state.message}</p>
      <button className={styles.submit} disabled={!enabled || pending}>{pending ? 'Entrando…' : <>Iniciar sesión <span aria-hidden="true">→</span></>}</button>
    </form>}
    <button type="button" className={styles.switchMode} disabled={pending || registering} onClick={() => setCreating(value => !value)}>{creating ? '¿Ya tienes cuenta? Inicia sesión' : '¿Aún no tienes cuenta? Créala aquí'}</button>
  </>;
}
