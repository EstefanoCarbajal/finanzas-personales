'use client';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { soles, toCents } from '@/lib/money.mjs';
import CreditCardActions, { type UpdateCreditCard, type DeleteCreditCard } from './credit-card-actions';
import s from './credit-cards.module.css';
import { BANK_GROUPS } from '@/lib/banks.mjs';

export type CreditCard = { id: string; name: string; bank_code?: string; currency?: string; credit_limit: string; opening_debt: string; last_four: string | null; debt: string; available: string };
type Result = { success: boolean; message: string };
type Action = (form: FormData) => Promise<Result>;
type Account = { id: string; name: string; currency?: string };
const money = (value: string, currency?: string) => currency === 'USD' ? `$ ${value}` : soles(value);

function PayCard({ card, accounts, today, pay, disabled, onBusy }: { card: CreditCard; accounts: Account[]; today: string; pay: Action; disabled: boolean; onBusy: (busy: boolean) => void }) {
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<Result>({ success: false, message: '' });
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  return <form className={s.form} onSubmit={event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    data.set('kind', 'transfer'); data.set('destination_id', card.id); data.set('description', `Pago: ${card.name}`.slice(0, 100)); data.set('request_id', requestId);
    setFeedback({ success: false, message: '' });
    onBusy(true);
    start(async () => { try { const result = await pay(data); setFeedback(result); if (result.success) { setRequestId(crypto.randomUUID()); form.reset(); } } catch { setFeedback({ success: false, message: 'No pudimos registrar el pago. Inténtalo de nuevo.' }); } finally { onBusy(false); } });
  }}><fieldset disabled={pending || disabled}><label>Desde tu cuenta<select name="account_id" required>{accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label><div className={s.pair}><label>Importe · S/<input name="amount" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder={card.debt} onChange={event => { event.target.value = event.target.value.replace(',', '.'); }} /></label><label>Fecha<input name="occurred_on" type="date" min="1900-01-01" max={today} defaultValue={today} required /></label></div><button className={s.primary} disabled={pending || !accounts.length || toCents(card.debt) === BigInt(0)}>{pending ? 'Guardando…' : 'Registrar pago'}</button></fieldset><p className={s.note}>Reduce la deuda. No se registra como otro gasto.</p><p className={feedback.success ? s.success : s.error} role="status">{feedback.message}</p></form>;
}


export default function CreditCards({ cards, accounts, today, create, pay, update, remove, currency }: { cards: CreditCard[]; accounts: Account[]; today: string; create: Action; pay: Action; update: UpdateCreditCard; remove: DeleteCreditCard; currency?: string }) {
  const id = useId();
  const grid = useRef<HTMLDivElement>(null);
  const [mutating, setMutating] = useState(false);
  const [removedId, setRemovedId] = useState<string | null>(null);
  const visibleCards = currency ? cards.filter(card => (card.currency || 'PEN') === currency) : cards;
  const visibleAccounts = currency ? accounts.filter(account => (account.currency || 'PEN') === currency) : accounts;
  useEffect(() => {
    if (removedId && !visibleCards.some(card => card.id === removedId)) {
      (grid.current?.querySelector<HTMLElement>('[data-credit-options]') || createTrigger.current)?.focus();
      setRemovedId(null);
    }
  }, [visibleCards, removedId]);
  const details = useRef<HTMLDetailsElement>(null);
  const createTrigger = useRef<HTMLElement>(null);
  const [creating, start] = useTransition();
  const [feedback, setFeedback] = useState<Result>({ success: false, message: '' });
  const [formOpen, setFormOpen] = useState(false);
  const bankOptions = BANK_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.options.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</optgroup>);
  return <section className={s.workspace} data-credit-workspace aria-labelledby={id}>
    <div className={s.heading}><div><span className={s.creditIcon} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18m-13 5h3" /></svg></span><h2 id={id}>Tarjetas de crédito <span>{visibleCards.length}</span></h2></div><span className={s.creditTag}>Tu línea</span></div>
    <div ref={grid} className={s.grid}>{visibleCards.map(card => <article className={s.card} key={card.id}><div className={s.plastic}><div className={`${s.cardTop} ${s.cardTopActions}`}><CreditCardActions card={card} balance={card.debt} disabled={creating || mutating} rename={update} remove={remove} onBusy={setMutating} onResult={(message, removed) => { setFeedback({ success: true, message }); if (removed) setRemovedId(removed); }} /></div><span className={s.chip} aria-hidden="true" /><h3>{card.name}</h3><span className={s.digits}>{card.last_four ? `•••• ${card.last_four}` : 'Tarjeta personal'}</span><div className={s.available}><strong>{money(card.available, card.currency)}</strong></div></div><div className={s.cardBody}><div className={s.figures}><div><span>Deuda actual</span><strong>{money(card.debt, card.currency)}</strong></div><div><span>Línea total</span><strong>{money(card.credit_limit, card.currency)}</strong></div></div><progress aria-label={`Crédito utilizado de ${card.name}`} value={Number(toCents(card.debt) * BigInt(10000) / toCents(card.credit_limit)) / 100} max={100} /><details className={s.payment}><summary>Registrar pago <span aria-hidden="true">↗</span></summary><PayCard onBusy={setMutating} disabled={creating || mutating} card={card} accounts={visibleAccounts} today={today} pay={pay} /></details></div></article>)}
    <div className={s.newCard}><details ref={details} open={formOpen} onToggle={event => setFormOpen(event.currentTarget.open)}><summary ref={createTrigger} aria-disabled={creating || mutating} onClick={event => { if (creating || mutating) event.preventDefault(); }}><span className={s.addArt} aria-hidden="true">＋</span><strong>Nueva tarjeta</strong></summary><form className={s.form} onSubmit={event => {
      event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setFeedback({ success: false, message: '' });
      start(async () => { try { const result = await create(data); setFeedback(result); if (result.success) { form.reset(); setFormOpen(false); createTrigger.current?.focus(); } } catch { setFeedback({ success: false, message: 'No pudimos crear la tarjeta. Inténtalo de nuevo.' }); } });
    }}><fieldset disabled={creating || mutating}><label>Nombre<input name="name" required maxLength={80} placeholder="Ej. Visa personal" /></label><label>Línea de crédito · S/<input name="credit_limit" inputMode="decimal" required pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14} placeholder="5000.00" onChange={event => { event.target.value = event.target.value.replace(',', '.'); }} /></label><label>Deuda inicial · S/<input name="opening_debt" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14} defaultValue="0.00" onChange={event => { event.target.value = event.target.value.replace(',', '.'); }} /></label><label>Últimos 4 dígitos <span>Opcional</span><input name="last_four" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="1234" autoComplete="off" /></label><p className={s.note}>La deuda inicial no cuenta como gasto de este mes. Solo registra aquí los últimos cuatro dígitos.</p><button className={s.primary} disabled={creating}>{creating ? 'Guardando…' : 'Añadir tarjeta'}</button></fieldset></form></details><p className={feedback.success ? s.success : s.error} role="status">{feedback.message}</p></div></div>

  </section>;
}
