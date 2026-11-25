'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import type { PlanningCategory, PlanningResult } from './planning-workspace';
import s from './planning-workspace.module.css';
import p from './future-payment-form.module.css';
import MovementModal from './movement-modal';
import PaymentSourceOptions, { type PaymentSourceAccount } from './payment-source-options';

const calendarMonth = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'UTC' });

export default function PlanningForm({ kind, categories, accounts = [], month, today, save }: {
  kind: 'budget' | 'payment'; categories: PlanningCategory[]; accounts?: PaymentSourceAccount[];
  month: string; today: string; save?: (form: FormData) => Promise<PlanningResult>;
}) {
  const payment = kind === 'payment';
  const expenseCategories = categories.filter(category => category.kind === 'expense');
  const [draft, setDraft] = useState({ payment_mode: 'manual', automatic_time: '09:00', amount: '', description: '', due_on: today, months: '1', category_id: expenseCategories[0]?.id || '', account_id: accounts[0]?.id || '', currency: accounts[0]?.currency || 'PEN' });
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const scheduleHint = useId();
  const busy = useRef(false);
  const categoryId = expenseCategories.some(c => c.id === draft.category_id) ? draft.category_id : expenseCategories[0]?.id || '';
  const currencyAccounts = accounts.filter(account => (account.currency || 'PEN') === draft.currency);
  const accountId = currencyAccounts.some(a => a.id === draft.account_id) ? draft.account_id : currencyAccounts[0]?.id || '';
  const unavailable = !expenseCategories.length || (payment && !currencyAccounts.length);
  const automatic = draft.payment_mode === 'automatic';
  const repeats = draft.months !== '1';
  const [, dueMonth, dueDay] = draft.due_on.split('-');
  const amountSize = draft.amount.length > 8 ? 'long' : draft.amount.length > 6 ? 'medium' : undefined;
  function change(field: keyof typeof draft, value: string) { setDraft(current => ({ ...current, [field]: value })); }
  function changeDate(date: string) {
    setDraft(current => date
      ? { ...current, due_on: date }
      : { ...current, due_on: '', payment_mode: 'manual', months: '1' });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!save || busy.current) return;
    const form = new FormData(event.currentTarget);
    busy.current = true;
    setPending(true);
    setResult(null);
    try {
      const response = await save(form);
      setResult(response);
      if (response.success) {
        setDraft(current => ({ ...current, amount: '', description: '' }));
        setOpen(false);
      }
    } catch { setResult({ success: false, message: 'No pudimos guardar. Tus datos siguen aquí; revisa la conexión e inténtalo de nuevo.' }); }
    finally { busy.current = false; setPending(false); }
  }
  const amount = <input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14} required placeholder="0.00" value={draft.amount} onChange={event => change('amount', event.target.value.replace(',', '.'))} />;
  const category = <label>{payment ? 'Categoría' : 'Categoría de gasto'}
    <select name="category_id" required value={categoryId} onChange={event => change('category_id', event.target.value)}>
      {!expenseCategories.length && <option value="">Crea una categoría primero</option>}
      {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
  </label>;
  const error = !result?.success ? result?.message : '';

  return <div className={s.creatorAction}>
    <button type="button" className={s.button} aria-haspopup="dialog" onClick={() => { setResult(null); setOpen(true); }}><span aria-hidden="true">＋</span> {payment ? 'Añadir pago futuro' : 'Añadir presupuesto'}</button>
    <MovementModal heading={payment ? 'Añadir pago futuro' : 'Añadir o ajustar presupuesto'} variant={payment ? 'payment' : undefined} open={open} onClose={() => { if (!busy.current) setOpen(false); }} pending={pending} demo={!save}>
      {payment ? <form className={p.form} onSubmit={submit}>
        <input type="hidden" name="month" value={month} />
        <fieldset className={p.fields} disabled={pending}>
          <div className={p.hero}>
            <label className={p.amount} data-size={amountSize}>
              Importe por pago
              <span className={p.amountValue}><span aria-hidden="true">{draft.currency === 'USD' ? '$' : 'S/'}</span>{amount}</span>
            </label>
            <div className={p.art} aria-hidden="true">
              <span className={p.spark}>✦</span>
              <div className={p.calendar}>
                <span>{dueMonth ? calendarMonth.format(Date.UTC(2000, Number(dueMonth) - 1)).replace('.', '') : 'Sin fecha'}</span>
                <strong>{dueDay || '–'}</strong>
              </div>
            </div>
          </div>

          <div className={p.pair}>
            <label>Descripción<input name="description" maxLength={100} required placeholder="Ej. Internet" value={draft.description} onChange={event => change('description', event.target.value)} /></label>
            {category}
          </div>
          <div className={p.source}>
            <label>Moneda<select value={draft.currency} onChange={event => change('currency', event.target.value)}><option value="PEN">Soles (PEN)</option><option value="USD">Dólares (USD)</option></select></label>
            <label>Cuenta o tarjeta
              <select name="account_id" required value={accountId} onChange={event => change('account_id', event.target.value)}>
                {currencyAccounts.length ? <PaymentSourceOptions accounts={currencyAccounts} /> : <option value="">Sin cuentas en esta moneda</option>}
              </select>
            </label>
          </div>

          <div className={p.schedule}>
            <div className={p.pair}>
              <label>Vencimiento<input name="due_on" type="date" min={today} required={automatic || repeats} value={draft.due_on} onChange={event => changeDate(event.target.value)} /></label>
              <label>Frecuencia<select name="months" disabled={!draft.due_on} value={draft.months} aria-describedby={scheduleHint} onChange={event => change('months', event.target.value)}>{Array.from({ length: 24 }, (_, i) => <option key={i + 1} value={i + 1}>{i === 0 ? 'Una sola vez' : `Mensual · ${i + 1} meses`}</option>)}</select></label>
            </div>
            <label className={p.noDue}><input type="checkbox" checked={!draft.due_on} onChange={event => changeDate(event.target.checked ? '' : today)} /> Sin vencimiento</label>
            <fieldset className={p.mode}>
              <legend>Registro del gasto</legend>
              <div className={p.options}>
                <label><input type="radio" name="payment_mode" value="manual" checked={!automatic} onChange={() => change('payment_mode', 'manual')} /> Manual</label>
                <label><input type="radio" name="payment_mode" value="automatic" disabled={!draft.due_on} checked={automatic} aria-describedby={scheduleHint} onChange={() => change('payment_mode', 'automatic')} /> Automático</label>
              </div>
            </fieldset>
            {automatic && <label className={p.time}>Hora de Lima<input name="automatic_time" type="time" required value={draft.automatic_time} onChange={event => change('automatic_time', event.target.value)} /></label>}
            <p id={scheduleHint} className={p.hint}>
              {!draft.due_on ? 'Elige una fecha para repetir o automatizar.' : automatic ? 'Registra el gasto en la app, sin cobro bancario.' : 'Confirma el gasto cuando lo pagues.'}
              {repeats && Number(dueDay) > 28 && ' En meses más cortos se usa el último día.'}
            </p>
          </div>
          <div className={p.footer}>
            <p role="alert" className={p.error}>{error}</p>
            {(!save || unavailable) && <p className={p.hint}>{!save ? 'Vista previa. Guardado en el espacio privado.' : 'Selecciona una cuenta y una categoría de gasto.'}</p>}
            <button className={p.save} disabled={pending || unavailable || !save}>{pending ? 'Guardando…' : repeats ? `Guardar ${draft.months} pagos` : 'Guardar pago'}<span className={pending ? p.spinner : undefined} aria-hidden="true">{pending ? '' : '→'}</span></button>
          </div>
        </fieldset>
      </form> : <>
        <form onSubmit={submit} className={`${s.modalForm} ${s.form}`} aria-busy={pending} data-demo={!save || undefined}>
          <input type="hidden" name="month" value={month} />
          <fieldset disabled={pending}>
            <div className={s.fields}><label>Límite mensual (S/){amount}</label>{category}</div>
            <button className={s.button} disabled={unavailable || !save}>{pending ? 'Guardando…' : 'Guardar presupuesto'}</button>
          </fieldset>
          <p className={s.formNote}>{!save ? 'Vista previa. Disponible para guardar en tu espacio privado.' : unavailable ? 'Necesitas una categoría de gasto.' : 'Si la categoría ya tiene presupuesto, se actualizará su límite.'}</p>
        </form>
        <p role="status" className={s.message}>{error}</p>
      </>}
    </MovementModal>
    <p role="status" className={s.success}>{result?.success ? result.message : ''}</p>
  </div>;
}
