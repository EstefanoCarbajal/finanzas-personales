'use client';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { soles, toCents } from '@/lib/money.mjs';
import CreditCardActions, { type UpdateCreditCard, type DeleteCreditCard } from './credit-card-actions';
import s from './credit-cards.module.css';
import CatalogCardFace from './catalog-card-face';
import { catalogCardName } from '@/lib/card-catalog.mjs';
import CardCatalogPicker from './card-catalog-picker';
import WalletCreateModal from './wallet-create-modal';

export type CreditCard = { id: string; name: string; bank_code?: string | null; credit_model?: string | null; credit_network?: string | null; currency?: string; credit_limit: string; opening_debt: string; last_four: string | null; debt: string; available: string };
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
  const createTrigger = useRef<HTMLButtonElement>(null);
  const [creating, start] = useTransition();
  const [feedback, setFeedback] = useState<Result>({ success: false, message: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [draftKey, setDraftKey] = useState(0);
  const [lastFour, setLastFour] = useState('');
  return <section className={s.workspace} data-credit-workspace aria-labelledby={id}>
    <div className={s.heading}><div><span className={s.creditIcon} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18m-13 5h3" /></svg></span><h2 id={id}>Tarjetas de crédito <span>{visibleCards.length}</span></h2></div><span className={s.creditTag}>Tu línea</span></div>
    <div ref={grid} className={s.grid}>{visibleCards.map(card => <article className={s.card} key={card.id} aria-label={card.name}>
      <div className={s.cardArt}>
        <CatalogCardFace bank={card.bank_code} network={card.credit_network} model={card.credit_model} name={card.name} lastFour={card.last_four} />
      </div>
      <div className={s.cardBody}>
        <div className={s.balanceRow}>
          <div><span>Crédito disponible</span><strong>{money(card.available, card.currency)}</strong></div>
          <CreditCardActions card={card} balance={card.debt} disabled={creating || mutating} rename={update} remove={remove}
            onBusy={setMutating} onResult={(message, removed) => { setFeedback({ success: true, message }); if (removed) setRemovedId(removed); }} />
        </div>
        {card.credit_model && card.name !== catalogCardName(card.bank_code, card.credit_network, card.credit_model, card.last_four) && <h3 className={s.alias}>{card.name}</h3>}
        <div className={s.figures}><div><span>Deuda actual</span><strong>{money(card.debt, card.currency)}</strong></div><div><span>Línea total</span><strong>{money(card.credit_limit, card.currency)}</strong></div></div>
        <progress aria-label={`Crédito utilizado de ${card.name}`} value={Number(toCents(card.debt) * BigInt(10000) / toCents(card.credit_limit)) / 100} max={100} />
        <details className={s.payment}><summary>Registrar pago <span aria-hidden="true">↗</span></summary><PayCard onBusy={setMutating} disabled={creating || mutating} card={card} accounts={visibleAccounts} today={today} pay={pay} /></details>
      </div>
    </article>)}
    <div className={s.newCard}><button type="button" className={s.newCardTrigger} ref={createTrigger} disabled={creating || mutating} onClick={() => { setFeedback({ success: false, message: '' }); setFormOpen(true); }}><span className={s.addArt} aria-hidden="true">＋</span><strong>Nueva tarjeta</strong></button><p className={feedback.success ? s.success : s.error} role="status">{!formOpen && feedback.message}</p></div></div>
    <WalletCreateModal open={formOpen} onClose={() => setFormOpen(false)} pending={creating} kind="credit">
      <form className={s.form} onSubmit={event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        if (!data.get('catalog_model')) return;
        setFeedback({ success: false, message: '' });
        start(async () => {
          try {
            const result = await create(data);
            setFeedback(result);
            if (result.success) {
              form.reset();
              setDraftKey(key => key + 1);
              setLastFour('');
              setFormOpen(false);
            }
          } catch {
            setFeedback({ success: false, message: 'No pudimos crear la tarjeta. Inténtalo de nuevo.' });
          }
        });
      }}>
        <fieldset disabled={creating || mutating}>
          <CardCatalogPicker key={draftKey} lastFour={lastFour}>
            <div className={s.creditFields}>
              <div className={s.amountPair}>
                <label>Línea de crédito · S/
                  <input name="credit_limit" inputMode="decimal" required pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14}
                    placeholder="5000.00" onChange={event => { event.target.value = event.target.value.replace(',', '.'); }} />
                </label>
                <label>Deuda inicial · S/
                  <input name="opening_debt" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14}
                    defaultValue="0.00" onChange={event => { event.target.value = event.target.value.replace(',', '.'); }} />
                </label>
              </div>
              <label>Últimos 4 dígitos (opcional)
                <input name="last_four" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="1234"
                  autoComplete="off" value={lastFour} onChange={event => setLastFour(event.target.value)} />
              </label>
              <p className={s.note}>La deuda inicial no cuenta como gasto de este mes.</p>
              <button className={s.primary} disabled={creating}>{creating ? 'Guardando…' : 'Añadir tarjeta'}</button>
            </div>
          </CardCatalogPicker>
        </fieldset>
        <p className={feedback.success ? s.success : s.error} role="status">{formOpen && feedback.message}</p>
      </form>
    </WalletCreateModal>
  </section>;
}
