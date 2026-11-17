'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { soles } from '@/lib/money.mjs';
import type { Account } from './accounts-workspace';
import s from './account-actions.module.css';
import { BANK_GROUPS } from '@/lib/banks.mjs';

export type AccountMutationResult = { success: boolean; message: string };
export type RenameAccount = (id: string, name: string, bankCode: string) => Promise<AccountMutationResult>;
export type RemoveAccount = (id: string) => Promise<AccountMutationResult>;

export default function AccountActions({ account, balance, disabled, rename, remove, onBusy, onResult }: {
  account: Account; balance: string; disabled: boolean; rename: RenameAccount; remove: RemoveAccount;
  onBusy: (busy: boolean) => void; onResult: (message: string, removedId?: string) => void;
}) {
  const menuId = useId(), titleId = useId(), descriptionId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const backdrop = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const [name, setName] = useState(account.name);
  const [bank, setBank] = useState(account.bank_code || 'BCP');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => menu.current?.hidePopover();
    window.addEventListener('scroll', close, true); window.addEventListener('resize', close);
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close); };
  }, [menuOpen]);
  useEffect(() => {
    if (!mode) return;
    const node = dialog.current!;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    if (mode === 'delete') cancel.current?.focus(); else nameInput.current?.focus();
    return () => { node.close(); document.body.style.overflow = overflow; trigger.current?.focus({ preventScroll: true }); };
  }, [mode]);

  function open(nextMode: 'edit' | 'delete') {
    menu.current?.hidePopover(); setName(account.name); setBank(account.bank_code || 'BCP'); setMessage(''); setMode(nextMode);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending || !mode) return;
    setPending(true); onBusy(true); setMessage('');
    try {
      const result = mode === 'edit' ? await rename(account.id, name, bank) : await remove(account.id);
      if (result.success) { setMode(null); onResult(result.message, mode === 'delete' ? account.id : undefined); } else setMessage(result.message);
    } catch { setMessage('No pudimos guardar el cambio. Inténtalo otra vez.'); }
    finally { setPending(false); onBusy(false); }
  }

  return <div className={s.actions} data-account-actions="" onPointerDown={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}>
    <button ref={trigger} type="button" popoverTarget={menuId} aria-expanded={menuOpen} aria-label={`Opciones de ${account.name}`} disabled={disabled || pending} className={s.trigger} onClick={() => {
      const rect = trigger.current!.getBoundingClientRect();
      setPosition({ top: Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 120)), left: Math.max(12, Math.min(rect.right - 190, window.innerWidth - 202)) });
    }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z" /></svg></button>
    <div id={menuId} ref={menu} popover="auto" role="group" aria-label={`Acciones de ${account.name}`} className={s.menu} style={{ '--menu-top': `${position.top}px`, '--menu-left': `${position.left}px` } as CSSProperties} onToggle={event => setMenuOpen(event.newState === 'open')}>
      <button type="button" onClick={() => open('edit')}><span aria-hidden="true">✎</span>Editar cuenta</button>
      <button type="button" className={s.dangerItem} onClick={() => open('delete')}><span aria-hidden="true">×</span>Eliminar cuenta</button>
    </div>
    <dialog ref={dialog} className={s.dialog} aria-labelledby={titleId} aria-describedby={mode === 'delete' ? descriptionId : undefined} aria-busy={pending} onCancel={event => { event.preventDefault(); if (!pending) setMode(null); }} onPointerDown={event => { backdrop.current = event.target === event.currentTarget; }} onClick={event => { if (backdrop.current && event.target === event.currentTarget && !pending) setMode(null); backdrop.current = false; }}>
      <div className={s.surface}>
        <header className={s.header}><span className={`${s.symbol} ${mode === 'delete' ? s.removeSymbol : ''}`} aria-hidden="true">{mode === 'delete' ? '−' : '✎'}</span><h2 id={titleId}>{mode === 'delete' ? '¿Eliminar cuenta?' : 'Editar cuenta'}</h2><button type="button" aria-label="Cerrar opciones de cuenta" disabled={pending} onClick={() => setMode(null)}>×</button></header>
        <div className={s.accountPreview}><span aria-hidden="true">▱</span><div><strong>{account.name}</strong><small>{soles(balance)}</small></div></div>
        <form onSubmit={submit}>
          {mode === 'edit' ? <div className={s.editFields}>
            <label className={s.nameLabel}>Nombre<input ref={nameInput} name="name" aria-label="Nuevo nombre de cuenta" maxLength={80} required value={name} disabled={pending} onChange={event => setName(event.target.value)} /></label>
            <label className={s.nameLabel}>Banco<select name="bank_code" aria-label="Banco de la cuenta" required value={bank} disabled={pending} onChange={event => setBank(event.target.value)}><option value="">Selecciona tu banco</option>{BANK_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.options.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</optgroup>)}</select></label>
          </div> : <p id={descriptionId} className={s.description}>Solo puedes eliminar cuentas sin movimientos, metas ni pagos asociados.</p>}
          <p className={s.message} role="status">{message}</p>
          <div className={s.footer}><button ref={cancel} type="button" disabled={pending} onClick={() => setMode(null)}>{mode === 'delete' ? 'Conservar cuenta' : 'Cancelar'}</button><button type="submit" disabled={pending} className={mode === 'delete' ? s.deleteButton : s.saveButton}>{pending ? 'Guardando…' : mode === 'delete' ? 'Eliminar cuenta' : 'Guardar cambios'}</button></div>
        </form>
      </div>
    </dialog>
  </div>;
}
