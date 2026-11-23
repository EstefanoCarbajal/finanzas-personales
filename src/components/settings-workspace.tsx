'use client';

import type { ReactNode } from 'react';
import { useId, useRef, useState, useTransition } from 'react';
import SelectedAvatar from './selected-avatar';
import s from './settings-workspace.module.css';

type SaveAction = (form: FormData) => Promise<{ success: boolean; message: string }>;

function Glyph({ name }: { name: 'lock' | 'mail' | 'card' | 'shield' }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'mail' ? <><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m4 7 8 6 8-6" /></> : name === 'lock' ? <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></> : name === 'card' ? <><rect x="2" y="4" width="20" height="16" rx="4" /><path d="M2 9h20M6 15h4" /></> : <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>}</svg>;
}

function CredentialEditor({ kind, email, demo, saveAction }: { kind: 'email' | 'password'; email: string; demo: boolean; saveAction?: SaveAction }) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const [show, setShow] = useState(false);
  const isEmail = kind === 'email';
  return <div className={s.editor}>
    <div className={s.row}><span className={s.icon}><Glyph name={isEmail ? 'mail' : 'lock'} /></span><div className={s.rowCopy}><h3>{isEmail ? 'Correo electrónico' : 'Contraseña'}</h3><p>{isEmail ? email : 'Una clave solo tuya'}</p></div><button ref={trigger} type="button" className={s.edit} aria-expanded={open} aria-controls={id} disabled={pending || success} onClick={() => { setOpen(!open); setMessage(''); }}> {open ? 'Cerrar' : 'Cambiar'}<span aria-hidden="true">{open ? '−' : '↗'}</span></button></div>
    {open && <form id={id} className={s.form} aria-busy={pending} onSubmit={event => {
      event.preventDefault();
      if (pending || demo || !saveAction) return;
      const form = event.currentTarget;
      const values = new FormData(form);
      setMessage('');
      startTransition(async () => {
        try {
          const result = await saveAction(values);
          setSuccess(result.success); setMessage(result.message);
          if (result.success) form.reset();
        } catch { setMessage('No pudimos guardar el cambio. Inténtalo de nuevo.'); }
      });
    }}>
      <input type="hidden" name="kind" value={kind} />
      <fieldset disabled={pending || success || demo}>
        {isEmail ? <label>Nuevo correo<input autoFocus type="email" name="email" autoComplete="email" maxLength={254} required placeholder="tu@correo.com" /></label> : <div className={s.fieldGrid}><label>Nueva contraseña<input autoFocus type={show ? 'text' : 'password'} name="password" autoComplete="new-password" minLength={12} maxLength={128} required aria-describedby={`${id}-hint`} /></label><label>Repetir contraseña<input type={show ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password" minLength={12} maxLength={128} required /></label></div>}
        {!isEmail && <p id={`${id}-hint`} className={s.hint}>Entre 12 y 128 caracteres.</p>}
        <label>Contraseña actual<input type={show ? 'text' : 'password'} name="currentPassword" autoComplete="current-password" maxLength={128} required /></label>
        <label className={s.show}><input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} />Mostrar {isEmail ? 'contraseña' : 'contraseñas'}</label>
      </fieldset>
      <p className={s.hint}>{demo ? 'Vista previa · Los cambios de acceso están disponibles en tu cuenta privada.' : isEmail ? 'Usarás el nuevo correo para entrar. Revisa que esté bien escrito: no enviaremos un correo de verificación. Se cerrarán todas tus sesiones.' : 'Al guardar, se cerrarán todas tus sesiones. Vuelve a entrar con tu nueva contraseña.'}</p>
      <div className={s.formActions}>{success ? <a className={s.primary} href="/login">Volver a iniciar sesión →</a> : <><button type="submit" className={s.primary} disabled={pending || demo || !saveAction}>{pending ? 'Guardando…' : 'Guardar cambio'}</button><button type="button" className={s.cancel} disabled={pending} onClick={() => { setOpen(false); setMessage(''); trigger.current?.focus(); }}>Cancelar</button></>}</div>
      <p className={success ? s.success : s.error} role="status">{message}</p>
    </form>}
  </div>;
}

export default function SettingsWorkspace({ email = 'hola@ejemplo.com', demo = false, saveAction, creditCards, userCreation }: { email?: string; demo?: boolean; saveAction?: SaveAction; creditCards?: ReactNode; userCreation?: ReactNode }) {
  return <div className={s.workspace}>
    <section className={s.hero} aria-labelledby="settings-title"><div className={s.heroCopy}><span className={s.eyebrow}>TU ESPACIO, TUS REGLAS</span><h1 id="settings-title">Todo a tu manera.</h1><p>Los detalles que hacen tu cuenta, tuya.</p><span className={s.privateBadge}><Glyph name="shield" />{demo ? 'Explorando la demo' : 'Espacio privado'}</span></div><div className={s.portrait} aria-hidden="true"><span className={s.orbit} /><SelectedAvatar width={156} height={156} /><span className={s.portraitBadge}>✦</span></div></section>
    <div className={s.layout}><section className={s.account} aria-labelledby="account-settings"><div className={s.sectionHeading}><span className={s.sectionNumber}>01</span><div><h2 id="account-settings">Acceso y seguridad</h2><p>El control empieza contigo.</p></div><span className={s.headingSpark} aria-hidden="true">✧</span></div><CredentialEditor kind="email" email={email} demo={demo} saveAction={saveAction} /><CredentialEditor kind="password" email={email} demo={demo} saveAction={saveAction} /><div className={s.sessionNote}><Glyph name="shield" /><span>Los cambios de acceso requieren tu contraseña actual.</span></div></section>
    <section className={s.future} aria-labelledby="future-payments"><div className={s.futureTop}><span className={s.sectionNumber}>02</span><span className={s.soon}>Tu billetera</span></div><div className={s.cardsArt} aria-hidden="true"><div className={s.backCard} /><div className={s.frontCard}><span>finanzas ✦</span><span className={s.chip} /><span>•••• &nbsp; •••• &nbsp; ••••</span></div></div><h2 id="future-payments">Tus pagos, en un lugar.</h2><p>Tus tarjetas de crédito ya tienen su propio espacio. Más métodos de pago llegarán después.</p><div className={s.futureRow}><Glyph name="card" /><span>Métodos de pago</span><Glyph name="lock" /></div><a className={s.futureRow} href="#mis-tarjetas"><Glyph name="card" /><span>Tarjetas de crédito</span><span>↓</span></a><small>Otros métodos: próximamente</small></section></div>
    {userCreation}
    <div id="mis-tarjetas">{creditCards}</div>
    <div className={s.preferences}><div><span>HECHO PARA TI</span><h2>Tu moneda. Tu horario.</h2></div><dl><div><dt>Moneda</dt><dd>PEN · Sol peruano</dd></div><div><dt>Zona horaria</dt><dd>Lima · UTC−5</dd></div><div><dt>Idioma</dt><dd>Español · Perú</dd></div></dl></div>
  </div>;
}
