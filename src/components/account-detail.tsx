'use client';

import { useEffect, useId, useRef, useState, useTransition, type CSSProperties } from 'react';
import { soles } from '@/lib/money.mjs';
import { accountAllocation, accountMovements } from '@/lib/piggybank-policy.mjs';
import type { Account } from './accounts-workspace';
import MovementsTable, { type PrivateMovement } from '@/app/privado/movements-table';
import MovementModal from './movement-modal';
import s from './account-detail.module.css';

export type Piggybank = { id: string; account_id: string; slot: number; name: string; amount: string; target_on: string | null };
export type PiggybankActions = {
  rename: (id: string, name: string) => Promise<{ success: boolean; message: string }>;
  topUp: (id: string, amount: string, requestId: string) => Promise<{ success: boolean; message: string }>;
  create: (form: FormData) => Promise<{ success: boolean; message: string }>;
  release: (id: string, amount: string, expectedBalance: string, requestId: string) => Promise<{ success: boolean; message: string }>;
};

function Piggybank({ slot, full = true }: { slot: number; full?: boolean }) {
  return <svg className={s.jar} viewBox="0 0 120 132" fill="none" aria-hidden="true">
    <ellipse cx="61" cy="121" rx="43" ry="6" fill="currentColor" opacity=".08" />
    {full && <g className={s.coin}><circle cx="51" cy="18" r="12" fill="currentColor" /><path d="M51 12v12m-3-10h6m-6 8h6" stroke="var(--theme-surface)" strokeWidth="2" strokeLinecap="round" /></g>}
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 72C9 74 4 67 9 62c5-5 11 3 5 7" />
      <path d="M30 96v16c0 3 2 4 5 4h5c3 0 4-1 4-4v-10m30-3v13c0 3 1 4 4 4h5c3 0 5-1 5-4V93" fill="var(--theme-surface)" />
      <path d="M88 56c2-8-1-16-9-21-5 5-7 11-6 18" fill="var(--theme-surface)" />
      <path d="M20 76c0-19 16-32 38-32 13 0 24 4 31 12 8 4 14 12 14 23 0 18-19 29-44 29-24 0-39-12-39-32Z" fill="var(--theme-surface)" />
      <path d="M20 76c0-19 16-32 38-32 13 0 24 4 31 12 8 4 14 12 14 23 0 18-19 29-44 29-24 0-39-12-39-32Z" fill="currentColor" fillOpacity={full ? '.18' : '.06'} />
      <path d="M75 54c-5-5-6-14-3-22 10 1 17 7 17 16" fill="var(--theme-surface)" />
      <path d="M77 47c-1-3-1-6 0-8 3 1 5 3 6 5" opacity=".4" />
      <rect x="96" y="68" width="19" height="19" rx="7" fill="var(--theme-surface)" />
      <path d="M102 75v4m7-4v4" />
      <path d="M85 89c3 2 6 1 8-1" />
      <path d="M42 50c6-2 13-2 19 0" strokeWidth="4" />
    </g>
    {full && <ellipse className={s.water} cx="52" cy="92" rx="24" ry="10" fill="currentColor" fillOpacity=".08" />}
    <circle cx="88" cy="63" r="2.8" fill="currentColor" /><circle cx="89" cy="62" r=".8" fill="var(--theme-surface)" />
    <ellipse cx="88" cy="79" rx="4" ry="3" fill="currentColor" opacity=".15" />
    <circle cx="52" cy="80" r="13" fill="var(--theme-surface)" /><text x="52" y="87" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="800">{slot}</text>
  </svg>;
}

function PiggybankMenu({ bank, onRename, onRemove }: { bank: Piggybank; onRename: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus();
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  function choose(action: () => void) {
    setOpen(false);
    trigger.current?.focus();
    action();
  }
  return <div ref={root} className={s.options} data-open={open} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    if (open && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button') || []);
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
    } else if (!open && event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); }
  }}>
    <button ref={trigger} type="button" className={s.optionsTrigger} aria-label={'Opciones de ' + bank.name} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen(current => !current)}><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="4" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="10" cy="16" r="1.8" /></svg></button>
    {open && <div ref={menu} id={menuId} className={s.optionsMenu} role="menu" aria-label={'Opciones de ' + bank.name}><button type="button" role="menuitem" onClick={() => choose(onRename)}>Cambiar nombre</button><button type="button" role="menuitem" className={s.dangerOption} onClick={() => choose(onRemove)}>Eliminar alcancía</button></div>}
  </div>;
}

export default function AccountDetail({ account, balance, banks, movements, actions, onBack, demo = false }: {
  account: Account; balance: string; banks: Piggybank[]; movements: PrivateMovement[]; today: string; actions: PiggybankActions; onBack: () => void; demo?: boolean;
}) {
  const [deleting, setDeleting] = useState<Piggybank | null>(null);
  const cancelDelete = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (deleting) cancelDelete.current?.focus(); }, [deleting]);
  const [renaming, setRenaming] = useState<Piggybank | null>(null);
  const [editName, setEditName] = useState('');
  const renameInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (renaming) { renameInput.current?.focus(); renameInput.current?.select(); } }, [renaming]);
  const [adding, setAdding] = useState<Piggybank | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const addInput = useRef<HTMLInputElement>(null);
  const changeRequest = useRef('');
  useEffect(() => { if (adding) addInput.current?.focus(); }, [adding]);
  const [creating, setCreating] = useState(false);
  const [releasing, setReleasing] = useState<Piggybank | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [releaseAmount, setReleaseAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const requestId = useRef('');
  const busy = useRef(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const keepButton = useRef<HTMLButtonElement>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const jarsHeading = useRef<HTMLHeadingElement>(null);
  const successFocus = useRef(false);
  useEffect(() => { if (creating) nameInput.current?.focus(); }, [creating]);
  useEffect(() => { if (releasing) keepButton.current?.focus(); }, [releasing]);
  useEffect(() => {
    if (successFocus.current && !creating && !releasing && !adding && !renaming && !deleting && !pending) {
      (createButton.current?.disabled ? jarsHeading.current : createButton.current)?.focus({ preventScroll: true });
      successFocus.current = false;
    }
  }, [creating, releasing, adding, renaming, deleting, pending, banks.length]);
  const { reserved, free } = accountAllocation(balance, banks);
  const cents = BigInt(balance.replace('.', ''));
  const percentage = cents > BigInt(0) ? Number(BigInt(reserved.replace('.', '')) * BigInt(10000) / cents) / 100 : 0;
  const money = (value: string) => account.currency === 'USD' ? `$ ${value}` : soles(value);
  const history = accountMovements(movements, account.id);
  function openCreate() { setError(''); setCreating(true); if (!requestId.current) requestId.current = crypto.randomUUID(); }
  function submit(formElement: HTMLFormElement) {
    if (busy.current) return;
    busy.current = true;
    setError('');
    const form = new FormData(formElement);
    form.set('id', requestId.current);
    form.set('account_id', account.id);
    form.set('amount', String(form.get('amount') || '').replace(',', '.'));
    startTransition(async () => {
      try {
        const result = await actions.create(form);
        if (!result.success) { setError(result.message); return; }
        successFocus.current = true;
        setCreating(false); setName(''); setAmount(''); requestId.current = ''; setMessage(result.message);
      } catch { setError('No pudimos guardar. Conservamos tus datos para reintentar.'); }
      finally { busy.current = false; }
    });
  }
  function remove() {
    if (!deleting || busy.current) return;
    busy.current = true; setError('');
    startTransition(async () => {
      try {
        const result = await actions.release(deleting.id, deleting.amount, deleting.amount, changeRequest.current);
        if (!result.success) { setError(result.message); return; }
        successFocus.current = true; setDeleting(null); setMessage('Alcancía eliminada. Todo su dinero vuelve al saldo libre de esta cuenta.');
      } catch { setError('No pudimos eliminar la alcancía. Inténtalo de nuevo.'); }
      finally { busy.current = false; }
    });
  }
  function rename() {
    if (!renaming || busy.current) return;
    busy.current = true; setError('');
    startTransition(async () => {
      try {
        const result = await actions.rename(renaming.id, editName);
        if (!result.success) { setError(result.message); return; }
        successFocus.current = true; setRenaming(null); setMessage(result.message);
      } catch { setError('No pudimos cambiar el nombre. Conservamos tus datos para reintentar.'); }
      finally { busy.current = false; }
    });
  }
  function topUp() {
    if (!adding || busy.current) return;
    busy.current = true; setError('');
    startTransition(async () => {
      try {
        const result = await actions.topUp(adding.id, addAmount.replace(',', '.'), changeRequest.current);
        if (!result.success) { setError(result.message); return; }
        successFocus.current = true; setAdding(null); setAddAmount(''); setMessage(result.message);
      } catch { setError('No pudimos agregar el dinero. Conservamos el importe para reintentar.'); }
      finally { busy.current = false; }
    });
  }
  function release() {
    if (!releasing || busy.current) return;
    busy.current = true; setError('');
    startTransition(async () => {
      try {
        const result = await actions.release(releasing.id, releaseAmount.replace(',', '.'), releasing.amount, changeRequest.current);
        if (!result.success) { setError(result.message); return; }
        successFocus.current = true;
        setReleasing(null); setMessage(result.message);
      } catch { setError('No pudimos liberar el dinero. Inténtalo de nuevo.'); }
      finally { busy.current = false; }
    });
  }
  return <div className={s.detail}>
    <button type="button" className={s.back} onClick={onBack}>‹ Todas mis cuentas</button>
    <section className={s.hero} aria-labelledby="account-detail-title">
      <div className={s.heroCopy}><span className={s.bank}>{account.bank_code || 'Mi cuenta'} · {account.currency || 'PEN'}</span><h1 id="account-detail-title" tabIndex={-1}>{account.name}</h1><span className={s.balanceLabel}>Saldo de la cuenta</span><strong className={s.balance}>{money(balance)}</strong><div className={s.allocationBar} role="img" aria-label={`${money(reserved)} en alcancías y ${money(free)} libres`}><span style={{ width: `${Math.min(100, percentage)}%` }} /></div><div className={s.legend}><span><i />En alcancías <b>{money(reserved)}</b></span><span><i />Dinero libre <b>{money(free)}</b></span></div></div>
      <div className={s.heroArt} aria-hidden="true"><div className={s.orbit} /><Piggybank slot={banks.length} full={banks.length > 0} /><span className={s.spark}>✦</span><span className={s.artLabel}>Cada plan tiene su lugar</span></div>
    </section>
    <section aria-labelledby="piggybanks-title" className={s.piggybanks}>
      <div className={s.sectionHeading}><div><h2 ref={jarsHeading} tabIndex={-1} id="piggybanks-title">Tus alcancías <span>{banks.length}/4</span></h2><p>Separa hoy lo que usarás después.</p></div><button ref={createButton} type="button" className={s.primary} disabled={banks.length >= 4 || BigInt(free.replace('.', '')) <= BigInt(0)} onClick={openCreate}>＋ Crear alcancía</button></div>
      {message && <p className={s.success} role="status">{message}</p>}
      <div className={s.jars}>{[1, 2, 3, 4].map(slot => {
        const bank = banks.find(bank => Number(bank.slot) === slot);
        return bank ? <article key={slot} className={s.jarCard} style={{ '--jar-delay': `${slot * 65}ms` } as CSSProperties}>
          <div className={s.jarTop}><span className={s.slot}>Alcancía {slot}</span><PiggybankMenu bank={bank} onRename={() => { setError(''); setEditName(bank.name); setRenaming(bank); }} onRemove={() => { changeRequest.current = crypto.randomUUID(); setError(''); setDeleting(bank); }} /></div><Piggybank slot={slot} /><h3>{bank.name}</h3><strong className={s.jarAmount}>{money(bank.amount)}</strong><div className={s.jarActions}><button type="button" className={s.release} disabled={BigInt(free.replace('.', '')) <= BigInt(0)} onClick={() => { changeRequest.current = crypto.randomUUID(); setError(''); setAddAmount(''); setAdding(bank); }}>Agregar dinero</button><button type="button" className={s.release} onClick={() => { changeRequest.current = crypto.randomUUID(); setError(''); setReleaseAmount(bank.amount); setReleasing(bank); }}>Liberar dinero</button></div>
        </article> : <button type="button" key={slot} className={`${s.jarCard} ${s.emptyJar}`} disabled={BigInt(free.replace('.', '')) <= BigInt(0)} onClick={openCreate} aria-label={`Crear alcancía ${slot}`}><Piggybank slot={slot} full={false} /><strong>Un lugar para tu próximo plan</strong><span>＋ Separar dinero</span></button>;
      })}</div>
      <p className={s.note}>{BigInt(free.replace('.', '')) <= BigInt(0) && banks.length < 4 ? 'No hay saldo libre para otra alcancía. ' : ''}El dinero sigue en esta cuenta. Libéralo cuando quieras para gastarlo.</p>
    </section>
    <MovementsTable key={account.id} demo={demo} readOnly movements={history} accountContext={account.id} />
    <MovementModal open={creating} onClose={() => setCreating(false)} pending={pending} demo={demo} heading="Crea un espacio para tu plan">
      <form className={s.form} onSubmit={event => { event.preventDefault(); submit(event.currentTarget); }}>
        <div className={s.formIntro}><Piggybank slot={Math.min(4, banks.length + 1)} /><div><span>Disponible para separar</span><strong>{money(free)}</strong></div></div>
        <fieldset disabled={pending}><label>¿Para qué estás guardando?<input ref={nameInput} name="name" required maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Una escapada, el alquiler, un regalo…" /></label><div className={s.formRow}><label>Importe ({account.currency || 'PEN'})<input name="amount" required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} placeholder="0.00" /></label></div></fieldset>
        {error && <p className={s.error} role="alert">{error}</p>}<p className={s.note}>Tu saldo total se mantiene. Este importe pasa de dinero libre a reservado.</p><button className={s.primary} type="submit" disabled={pending}>{pending ? 'Separando…' : 'Guardar en mi alcancía'}</button>
      </form>
    </MovementModal>
    <MovementModal open={!!deleting} onClose={() => setDeleting(null)} pending={pending} demo={demo} heading="¿Eliminar esta alcancía?">
      {deleting && <div className={s.form}><div className={s.releaseRecord}><Piggybank slot={Number(deleting.slot)} /><h3>{deleting.name}</h3><strong>{money(deleting.amount)}</strong></div><p className={s.note}>Todo el dinero de esta alcancía ({money(deleting.amount)}) volverá al saldo libre de {account.name} y el espacio quedará disponible.</p>{error && <p role="alert" className={s.error}>{error}</p>}<div className={s.formRow}><button ref={cancelDelete} type="button" className={s.secondary} disabled={pending} onClick={() => setDeleting(null)}>Conservar alcancía</button><button type="button" className={s.primary} disabled={pending} onClick={remove}>{pending ? 'Eliminando…' : 'Sí, eliminar alcancía'}</button></div></div>}
    </MovementModal>
    <MovementModal open={!!renaming} onClose={() => setRenaming(null)} pending={pending} demo={demo} heading="Cambiar nombre de alcancía">
      {renaming && <form className={s.form} onSubmit={event => { event.preventDefault(); rename(); }}><fieldset disabled={pending}><label>Nombre de la alcancía<input ref={renameInput} required maxLength={60} value={editName} onChange={e => setEditName(e.target.value)} /></label></fieldset>{error && <p role="alert" className={s.error}>{error}</p>}<div className={s.formRow}><button type="button" className={s.secondary} disabled={pending} onClick={() => setRenaming(null)}>Cancelar</button><button type="submit" className={s.primary} disabled={pending}>{pending ? 'Guardando…' : 'Guardar nombre'}</button></div></form>}
    </MovementModal>
    <MovementModal open={!!adding} onClose={() => setAdding(null)} pending={pending} demo={demo} heading="Agregar dinero a tu alcancía">
      {adding && <form className={s.form} onSubmit={event => { event.preventDefault(); topUp(); }}><div className={s.releaseRecord}><Piggybank slot={Number(adding.slot)} /><h3>{adding.name}</h3><strong>{money(adding.amount)}</strong></div><p className={s.note}>Disponible para agregar: {money(free)}</p><fieldset disabled={pending}><label>Importe ({account.currency || 'PEN'})<input ref={addInput} required inputMode="decimal" value={addAmount} onChange={e => setAddAmount(e.target.value.replace(',', '.'))} placeholder="0.00" /></label></fieldset>{error && <p role="alert" className={s.error}>{error}</p>}<p className={s.note}>Se separa del dinero libre de esta cuenta. Tu saldo total se mantiene.</p><div className={s.formRow}><button type="button" className={s.secondary} disabled={pending} onClick={() => setAdding(null)}>Cancelar</button><button type="submit" className={s.primary} disabled={pending}>{pending ? 'Agregando…' : 'Agregar dinero'}</button></div></form>}
    </MovementModal>
    <MovementModal open={!!releasing} onClose={() => setReleasing(null)} pending={pending} demo={demo} heading="¿Cuánto quieres liberar?">
      {releasing && <div className={s.form}><div className={s.releaseRecord}><Piggybank slot={Number(releasing.slot)} /><h3>{releasing.name}</h3><strong>{money(releasing.amount)}</strong></div><fieldset disabled={pending}><label>Importe a liberar ({account.currency || 'PEN'})<input inputMode="decimal" value={releaseAmount} onChange={e => setReleaseAmount(e.target.value.replace(',', '.'))} placeholder="0.00" /></label><button type="button" className={s.secondary} onClick={() => setReleaseAmount(releasing.amount)}>Liberar todo · {money(releasing.amount)}</button></fieldset><p className={s.note}>El importe vuelve al dinero libre de {account.name}. Si liberas todo, este espacio queda disponible. No se registra un gasto ni se mueve dinero entre cuentas.</p>{error && <p role="alert" className={s.error}>{error}</p>}<div className={s.formRow}><button ref={keepButton} type="button" className={s.secondary} disabled={pending} onClick={() => setReleasing(null)}>Conservar alcancía</button><button type="button" className={s.primary} disabled={pending} onClick={release}>{pending ? 'Liberando…' : 'Sí, liberar dinero'}</button></div></div>}
    </MovementModal>
  </div>;
}
