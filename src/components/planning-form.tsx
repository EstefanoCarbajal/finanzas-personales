'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { PlanningCategory, PlanningResult } from './planning-workspace';
import s from './planning-workspace.module.css';
import MovementModal from './movement-modal';

export default function PlanningForm({ kind, categories, accounts = [], month, today, save }: {
  kind: 'budget' | 'payment'; categories: PlanningCategory[]; accounts?: { id: string; name: string; currency?: string }[];
  month: string; today: string; save?: (form: FormData) => Promise<PlanningResult>;
}) {
  const payment = kind === 'payment';
  const expenseCategories = categories.filter(category => category.kind === 'expense');
  const [draft, setDraft] = useState({ payment_mode: 'manual', automatic_time: '09:00', amount: '', description: '', due_on: today, category_id: expenseCategories[0]?.id || '', account_id: accounts[0]?.id || '' });
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const busy = useRef(false);
  const categoryId = expenseCategories.some(c => c.id === draft.category_id) ? draft.category_id : expenseCategories[0]?.id || '';
  const accountId = accounts.some(a => a.id === draft.account_id) ? draft.account_id : accounts[0]?.id || '';
  const unavailable = !expenseCategories.length || (payment && !accounts.length);
  function change(field: keyof typeof draft, value: string) { setDraft(current => ({ ...current, [field]: value })); }
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
  const form = <form onSubmit={submit} className={`${s.modalForm} ${s.form}`} aria-busy={pending} data-demo={!save || undefined}>
        <input type="hidden" name="month" value={month} />
        <fieldset disabled={pending}>
          {payment && <><div className={s.modeChoices}><label><input type="radio" name="payment_mode" value="manual" checked={draft.payment_mode==='manual'} onChange={()=>change('payment_mode','manual')} /><span>✓ Manual<small>Yo confirmo el gasto</small></span></label><label><input type="radio" name="payment_mode" value="automatic" checked={draft.payment_mode==='automatic'} onChange={()=>change('payment_mode','automatic')} /><span>ϟ Automático<small>Se registra por mí</small></span></label></div>{draft.payment_mode==='automatic' && <div className={s.autoNotice}><label>Hora de Lima<input name="automatic_time" type="time" required value={draft.automatic_time} onChange={e=>change('automatic_time',e.target.value)} /></label><p>Se descontará del saldo de esta cuenta en la aplicación. No realiza un cobro bancario. Si el servicio está detenido, se registrará al reanudarse.</p></div>}</>}
          {payment && <div className={s.fields}><label>Descripción<input name="description" maxLength={100} required placeholder="Ej. Internet de casa" value={draft.description} onChange={event => change('description', event.target.value)} /></label><label>Vence el<input name="due_on" type="date" min={today} required value={draft.due_on} onChange={event => change('due_on', event.target.value)} /></label></div>}
          <div className={s.fields}><label>{payment ? `Importe (${accounts.find(a=>a.id===accountId)?.currency === 'USD' ? 'USD' : 'PEN'})` : 'Límite mensual (S/)'}<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14} required placeholder="0.00" value={draft.amount} onChange={event => change('amount', event.target.value.replace(',', '.'))} /></label><label>Categoría de gasto<select name="category_id" required value={categoryId} onChange={event => change('category_id', event.target.value)}>{!expenseCategories.length && <option value="">Crea una categoría primero</option>}{expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
          {payment && <div className={s.fields}><label>Cuenta<select name="account_id" required value={accountId} onChange={event => change('account_id', event.target.value)}>{!accounts.length && <option value="">Crea una cuenta primero</option>}{accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label></div>}
          <button className={s.button} disabled={unavailable || !save}>{pending ? 'Guardando…' : payment ? 'Guardar pago futuro' : 'Guardar presupuesto'}</button>
        </fieldset>
        <p className={s.formNote}>{!save ? 'Vista previa. Disponible para guardar en tu espacio privado.' : unavailable ? 'Necesitas una categoría de gasto y, para pagos, una cuenta.' : payment ? (draft.payment_mode==='automatic' ? 'Registro único en la fecha y hora elegidas. Puedes cancelarlo antes.' : 'Se registra un gasto solo cuando confirmas que ya lo pagaste.') : 'Si la categoría ya tiene presupuesto, se actualizará su límite.'}</p>
      </form>;
  return <div className={s.creatorAction}>
    <button type="button" className={s.button} aria-haspopup="dialog" onClick={() => { setResult(null); setOpen(true); }}><span aria-hidden="true">＋</span> {payment ? 'Añadir pago futuro' : 'Añadir presupuesto'}</button>
    <MovementModal heading={payment ? 'Añadir pago futuro' : 'Añadir o ajustar presupuesto'} open={open} onClose={() => { if (!busy.current) setOpen(false); }} pending={pending} demo={!save}>
      {form}
      <p role="status" className={s.message}>{!result?.success ? result?.message : ''}</p>
    </MovementModal>
    <p role="status" className={s.success}>{result?.success ? result.message : ''}</p>
  </div>;
}
