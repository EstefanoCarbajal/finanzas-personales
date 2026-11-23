'use client';
import { useRef, useState, type ReactNode } from 'react';
import s from './settings-workspace.module.css';
export default function UserCreateForm({ create, children }: { children?: ReactNode; create: (form: FormData) => Promise<{ success: boolean; message: string }> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const busy = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return <section className={s.account} aria-labelledby="user-management-title"><div className={s.sectionHeading}><div><h2 id="user-management-title">Usuarios</h2><p>Cada usuario tiene su propio espacio y sus datos separados.</p></div></div><button ref={trigger} type="button" className={s.primary} aria-expanded={open} aria-controls="new-private-user" disabled={pending} onClick={() => { setOpen(current => !current); setResult(null); }}>Crear usuario</button>
    {open && <form id="new-private-user" className={s.form} aria-busy={pending} onSubmit={async event => {
      event.preventDefault(); if (busy.current) return;
      const form = event.currentTarget; const data = new FormData(form);
      busy.current = true; setPending(true); setResult(null);
      try { const response = await create(data); setResult(response); if (response.success) { form.reset(); setOpen(false); trigger.current?.focus(); } }
      catch { setResult({ success: false, message: 'No pudimos crear el usuario. Conservamos el formulario para reintentar.' }); }
      finally { busy.current = false; setPending(false); }
    }}><fieldset disabled={pending}><label>Correo del nuevo usuario<input autoFocus name="email" type="email" autoComplete="off" maxLength={254} required /></label><div className={s.fieldGrid}><label>Contraseña del nuevo usuario<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><label>Repetir contraseña<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label></div><p className={s.hint}>Entre 12 y 128 caracteres. No se enviará un correo automático.</p><label>Tu contraseña actual<input name="currentPassword" type="password" autoComplete="current-password" maxLength={128} required /></label></fieldset><div className={s.formActions}><button type="submit" className={s.primary} disabled={pending}>{pending ? 'Creando…' : 'Crear usuario'}</button><button type="button" className={s.cancel} disabled={pending} onClick={() => { setOpen(false); setResult(null); trigger.current?.focus(); }}>Cancelar</button></div></form>}
    {result && <p role="status" className={result.success ? s.success : s.error}>{result.message}</p>}
    {children}
  </section>;
}
