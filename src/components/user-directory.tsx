'use client';
import { useRef, useState, useEffect } from 'react';
import MovementModal from './movement-modal';
import s from './settings-workspace.module.css';
export type ManagedUser = { id: string; email: string; created_at: string; isAdmin: boolean };
type Result = { success: boolean; message: string };
export default function UserDirectory({ users, manage }: { users: ManagedUser[]; manage: (id: string, mode: 'edit' | 'delete', form: FormData) => Promise<Result> }) {
  const [selected, setSelected] = useState<{ user: ManagedUser; mode: 'edit' | 'delete' } | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const busy = useRef(false); const heading = useRef<HTMLHeadingElement>(null); const field = useRef<HTMLInputElement>(null);
  useEffect(() => { if (selected) field.current?.focus(); }, [selected]);
  return <div className={s.directory}><h3 ref={heading} tabIndex={-1}>Usuarios registrados</h3>
    {!selected && result && <p role="status" className={result.success ? s.success : s.error}>{result.message}</p>}
    <ul className={s.userList}>{users.map(user => <li key={user.id}><div><strong>{user.email}</strong><span>{user.isAdmin ? 'Administrador' : 'Usuario'} · Creado el {new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(user.created_at.replace(' ', 'T') + 'Z'))}</span></div>{user.isAdmin ? <span className={s.hint}>Cuenta protegida</span> : <div className={s.formActions}><button type="button" className={s.edit} aria-label={'Editar ' + user.email} disabled={pending} onClick={() => { setResult(null); setSelected({ user, mode: 'edit' }); }}>Editar</button><button type="button" className={s.cancel} aria-label={'Eliminar ' + user.email} disabled={pending} onClick={() => { setResult(null); setSelected({ user, mode: 'delete' }); }}>Eliminar</button></div>}</li>)}</ul>
    <MovementModal open={!!selected} onClose={() => { if (!busy.current) setSelected(null); }} pending={pending} heading={selected?.mode === 'delete' ? '¿Eliminar usuario y sus datos?' : 'Editar usuario'}>
      {selected && <form key={selected.user.id + selected.mode} className={s.form} onSubmit={async event => {
        event.preventDefault(); if (busy.current) return; const data = new FormData(event.currentTarget); busy.current = true; setPending(true); setResult(null);
        try { const response = await manage(selected.user.id, selected.mode, data); setResult(response); if (response.success) { setSelected(null); heading.current?.focus({ preventScroll: true }); } }
        catch { setResult({ success: false, message: 'No pudimos completar el cambio. Revisa la conexión e inténtalo de nuevo.' }); }
        finally { busy.current = false; setPending(false); }
      }}><fieldset disabled={pending}>
        {selected.mode === 'edit' ? <><label>Correo<input ref={field} name="email" type="email" defaultValue={selected.user.email} autoComplete="off" required maxLength={254} /></label><div className={s.fieldGrid}><label>Nueva contraseña (opcional)<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} /></label><label>Repetir nueva contraseña<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} /></label></div><p className={s.hint}>Deja las contraseñas vacías para conservar la actual. Al guardar se cerrarán las sesiones de este usuario.</p></> : <><p>Se eliminarán permanentemente <strong>{selected.user.email}</strong> y todos sus datos: movimientos, cuentas, metas, pagos, presupuestos, hábitos y preferencias. Esta acción no se puede deshacer.</p><label>Escribe su correo para confirmar<input ref={field} name="confirmEmail" type="email" autoComplete="off" required /></label></>}
        <label>Tu contraseña actual de administrador<input name="currentPassword" type="password" autoComplete="current-password" maxLength={128} required /></label>
      </fieldset>{result && !result.success && <p role="alert" className={s.error}>{result.message}</p>}<div className={s.formActions}><button type="button" className={s.cancel} disabled={pending} onClick={() => setSelected(null)}>Cancelar</button><button type="submit" className={s.primary} disabled={pending}>{pending ? 'Procesando…' : selected.mode === 'delete' ? 'Eliminar usuario y datos' : 'Guardar cambios'}</button></div></form>}
    </MovementModal>
  </div>;
}
