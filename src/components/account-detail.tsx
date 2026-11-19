'use client';

import { useEffect, useRef, useState, useTransition, type CSSProperties } from 'react';
import { soles } from '@/lib/money.mjs';
import { accountAllocation, accountMovements } from '@/lib/piggybank-policy.mjs';
import type { Account } from './accounts-workspace';
import MovementsTable, { type PrivateMovement } from '@/app/privado/movements-table';
import MovementModal from './movement-modal';
import s from './account-detail.module.css';

export type Piggybank = { id: string; account_id: string; slot: number; name: string; amount: string; target_on: string | null };
export type PiggybankActions = {
  create: (form: FormData) => Promise<{ success: boolean; message: string }>;
  release: (id: string) => Promise<{ success: boolean; message: string }>;
};
const formatDate = (value: string) => new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

function Jar({ slot, full = true }: { slot: number; full?: boolean }) {
  return <svg className={s.jar} viewBox="0 0 120 132" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="120" rx="38" ry="7" fill="currentColor" opacity=".08" />
    {full && <g className={s.coin}><circle cx="60" cy="22" r="12" fill="currentColor" /><path d="M60 16v12m-3-10h6m-6 8h6" stroke="var(--theme-surface)" strokeWidth="2" strokeLinecap="round" /></g>}
    <path d="M38 40v9c-13 8-18 19-18 36v15c0 11 9 17 40 17s40-6 40-17V85c0-17-5-28-18-36v-9" fill="currentColor" fillOpacity=".07" stroke="currentColor" strokeWidth="2" />
    {full && <path className={s.water} d="M23 80c16-11 26 10 41 0s22-7 33 0v20c0 9-11 14-37 14s-37-5-37-14V80Z" fill="currentColor" fillOpacity=".32" />}
    <rect x="33" y="34" width="54" height="12" rx="5" fill="currentColor" /><path d="M45 39h30" stroke="var(--theme-surface)" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 63c-4 5-5 12-5 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".3" />
    <rect x="44" y="69" width="32" height="28" rx="9" fill="var(--theme-surface)" /><text x="60" y="89" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="800">{slot}</text>
  </svg>;
}

export default function AccountDetail({ account, balance, banks, movements, today, actions, onBack, demo = false }: {
  account: Account; balance: string; banks: Piggybank[]; movements: PrivateMovement[]; today: string; actions: PiggybankActions; onBack: () => void; demo?: boolean;
}) {
  const [creating, setCreating] = useState(false);
  const [releasing, setReleasing] = useState<Piggybank | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
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
    if (successFocus.current && !creating && !releasing && !pending) {
      (createButton.current?.disabled ? jarsHeading.current : createButton.current)?.focus({ preventScroll: true });
      successFocus.current = false;
    }
  }, [creating, releasing, pending, banks.length]);
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
        setCreating(false); setName(''); setAmount(''); setDate(''); requestId.current = ''; setMessage(result.message);
      } catch { setError('No pudimos guardar. Conservamos tus datos para reintentar.'); }
      finally { busy.current = false; }
    });
  }
  function release() {
    if (!releasing || busy.current) return;
    busy.current = true; setError('');
    startTransition(async () => {
      try {
        const result = await actions.release(releasing.id);
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
      <div className={s.heroArt} aria-hidden="true"><div className={s.orbit} /><Jar slot={banks.length} full={banks.length > 0} /><span className={s.spark}>✦</span><span className={s.artLabel}>Cada plan tiene su lugar</span></div>
    </section>
    <section aria-labelledby="piggybanks-title" className={s.piggybanks}>
      <div className={s.sectionHeading}><div><h2 ref={jarsHeading} tabIndex={-1} id="piggybanks-title">Tus alcancías <span>{banks.length}/4</span></h2><p>Separa hoy lo que usarás después.</p></div><button ref={createButton} type="button" className={s.primary} disabled={banks.length >= 4 || BigInt(free.replace('.', '')) <= BigInt(0)} onClick={openCreate}>＋ Crear alcancía</button></div>
      {message && <p className={s.success} role="status">{message}</p>}
      <div className={s.jars}>{[1, 2, 3, 4].map(slot => {
        const bank = banks.find(bank => Number(bank.slot) === slot);
        const ready = !!bank?.target_on && bank.target_on <= today;
        return bank ? <article key={slot} className={`${s.jarCard} ${ready ? s.ready : ''}`} style={{ '--jar-delay': `${slot * 65}ms` } as CSSProperties}>
          <div className={s.jarTop}><span className={s.slot}>Alcancía {slot}</span>{ready && <span className={s.readyBadge}>Llegó el día</span>}</div><Jar slot={slot} /><h3>{bank.name}</h3><strong className={s.jarAmount}>{money(bank.amount)}</strong><p className={s.target}>{bank.target_on ? `${ready ? 'Para el' : 'Reservado hasta el'} ${formatDate(bank.target_on)}` : 'Sin fecha · A tu ritmo'}</p><button type="button" className={s.release} onClick={() => { setError(''); setReleasing(bank); }}>Liberar dinero</button>
        </article> : <button type="button" key={slot} className={`${s.jarCard} ${s.emptyJar}`} disabled={BigInt(free.replace('.', '')) <= BigInt(0)} onClick={openCreate} aria-label={`Crear alcancía ${slot}`}><Jar slot={slot} full={false} /><strong>Un lugar para tu próximo plan</strong><span>＋ Separar dinero</span></button>;
      })}</div>
      <p className={s.note}>{BigInt(free.replace('.', '')) <= BigInt(0) && banks.length < 4 ? 'No hay saldo libre para otra alcancía. ' : ''}El dinero sigue en esta cuenta. Libéralo antes de gastarlo; la fecha es un recordatorio.</p>
    </section>
    <MovementsTable key={account.id} demo={demo} readOnly movements={history} accountContext={account.id} />
    <MovementModal open={creating} onClose={() => setCreating(false)} pending={pending} demo={demo} heading="Crea un espacio para tu plan">
      <form className={s.form} onSubmit={event => { event.preventDefault(); submit(event.currentTarget); }}>
        <div className={s.formIntro}><Jar slot={Math.min(4, banks.length + 1)} /><div><span>Disponible para separar</span><strong>{money(free)}</strong></div></div>
        <fieldset disabled={pending}><label>¿Para qué estás guardando?<input ref={nameInput} name="name" required maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Una escapada, el alquiler, un regalo…" /></label><div className={s.formRow}><label>Importe ({account.currency || 'PEN'})<input name="amount" required inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value.replace(',', '.'))} placeholder="0.00" /></label><label>¿Cuándo lo usarás? <small>Opcional</small><input name="target_on" type="date" min={today} max="9999-12-31" value={date} onInput={e => setDate(e.currentTarget.value)} onChange={e => setDate(e.target.value)} /></label></div></fieldset>
        {error && <p className={s.error} role="alert">{error}</p>}<p className={s.note}>Tu saldo total se mantiene. Este importe pasa de dinero libre a reservado.</p><button className={s.primary} type="submit" disabled={pending}>{pending ? 'Separando…' : 'Guardar en mi alcancía'}</button>
      </form>
    </MovementModal>
    <MovementModal open={!!releasing} onClose={() => setReleasing(null)} pending={pending} demo={demo} heading="¿Liberar esta alcancía?">
      {releasing && <div className={s.form}><div className={s.releaseRecord}><Jar slot={Number(releasing.slot)} /><h3>{releasing.name}</h3><strong>{money(releasing.amount)}</strong></div><p className={s.note}>El importe vuelve al dinero libre de {account.name} y este espacio queda disponible. No se registra un gasto ni se mueve dinero entre cuentas.</p>{error && <p role="alert" className={s.error}>{error}</p>}<div className={s.formRow}><button ref={keepButton} type="button" className={s.secondary} disabled={pending} onClick={() => setReleasing(null)}>Conservar alcancía</button><button type="button" className={s.primary} disabled={pending} onClick={release}>{pending ? 'Liberando…' : 'Sí, liberar dinero'}</button></div></div>}
    </MovementModal>
  </div>;
}
