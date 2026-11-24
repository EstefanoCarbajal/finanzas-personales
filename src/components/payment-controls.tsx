'use client';

import { useEffect, useId, useRef, useState } from 'react';
import MovementModal from './movement-modal';
import type { PlanningPayment, PlanningCategory, PlanningResult } from './planning-workspace';
import s from './planning-workspace.module.css';

export type PaymentEdit = { description: string; amount: string; due_on: string; account_id: string; category_id: string; payment_mode: string; automatic_time: string };
export type ManagePayment = (id: string, mode: 'edit' | 'delete', input?: PaymentEdit) => Promise<PlanningResult>;
export default function PaymentControls({ payment, manage, demo, accounts, categories, today }: { payment: PlanningPayment; manage: ManagePayment; demo: boolean; accounts: { id: string; name: string; currency?: string; account_type?: string }[]; categories: PlanningCategory[]; today: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRoot = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus();
    function outside(event: PointerEvent) { if (event.target instanceof Node && !menuRoot.current?.contains(event.target)) setMenuOpen(false); }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [menuOpen]);
  function choose(next: 'edit' | 'delete') {
    setMenuOpen(false); trigger.current?.focus(); setResult(null);
    if (next === 'edit') setDraft(initial());
    setMode(next);
  }
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const initial = () => ({ description: payment.description, amount: payment.amount, due_on: payment.due_on, account_id: payment.account_id || accounts[0]?.id || '', category_id: payment.category_id || '', payment_mode: payment.automatic_at ? 'automatic' : 'manual', automatic_time: payment.automatic_time || '09:00' });
  const [draft, setDraft] = useState<PaymentEdit>(initial);
  function change(field: keyof PaymentEdit, value: string) { setDraft(current => ({ ...current, [field]: value })); }
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PlanningResult | null>(null);
  const busy = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (mode === 'edit') { input.current?.focus(); input.current?.select(); } else if (mode === 'delete') cancel.current?.focus(); }, [mode]);
  async function submit() {
    if (!mode || busy.current) return;
    busy.current = true; setPending(true); setResult(null);
    try {
      const response = await manage(payment.id, mode, { ...draft, amount: draft.amount.replace(',', '.') });
      setResult(response);
      if (response.success) {
        setMode(null);
        if (mode === 'delete') document.getElementById('payment-heading')?.focus({ preventScroll: true });
      }
    } catch { setResult({ success: false, message: 'No pudimos guardar el cambio. Conservamos tus datos para reintentar.' }); }
    finally { busy.current = false; setPending(false); }
  }
  return <>
    <div ref={menuRoot} className={s.budgetOptions} data-open={menuOpen} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenuOpen(false); }} onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) { event.preventDefault(); event.stopPropagation(); setMenuOpen(false); trigger.current?.focus(); }
      if (menuOpen && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button') || []);
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
        items[next]?.focus();
      } else if (!menuOpen && event.key === 'ArrowDown') { event.preventDefault(); setMenuOpen(true); }
    }}>
      <button ref={trigger} type="button" className={s.budgetOptionsTrigger} aria-label={'Opciones del pago futuro de ' + payment.description} aria-haspopup="menu" aria-expanded={menuOpen} aria-controls={menuOpen ? menuId : undefined} onClick={() => setMenuOpen(current => !current)}><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="4" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="10" cy="16" r="1.8" /></svg></button>
      {menuOpen && <div ref={menu} id={menuId} role="menu" aria-label={'Opciones del pago futuro de ' + payment.description} className={s.budgetOptionsMenu}><button type="button" role="menuitem" onClick={() => choose('edit')}>Editar</button><button type="button" role="menuitem" className={s.budgetDeleteOption} onClick={() => choose('delete')}>Eliminar</button></div>}
    </div>
    {!mode && result && <p role="status">{result.message}</p>}
    <MovementModal open={!!mode} onClose={() => { if (!busy.current) setMode(null); }} pending={pending} demo={demo} heading={mode === 'delete' ? '¿Eliminar pago futuro?' : 'Editar pago futuro'}>
      <form className={s.budgetEditor} onSubmit={event => { event.preventDefault(); submit(); }}><p className={s.budgetEditorCategory}>{payment.description}</p>
        {mode === 'edit' ? <fieldset disabled={pending} className={s.paymentEditFields}>
          <label>Descripción<input ref={input} required maxLength={100} value={draft.description} onChange={event => change('description', event.target.value)} /></label>
          <label>Importe ({accounts.find(account => account.id === draft.account_id)?.currency || 'PEN'})<input required inputMode="decimal" value={draft.amount} onChange={event => change('amount', event.target.value.replace(',', '.'))} /></label>
          <label>Vence el<input type="date" required value={draft.due_on} min={payment.due_on < today ? payment.due_on : today} max="9999-12-31" onChange={event => change('due_on', event.target.value)} /></label>
          <label>Cuenta o tarjeta<select required value={draft.account_id} onChange={event => change('account_id', event.target.value)}>{accounts.map(account => <option key={account.id} value={account.id}>{account.name} · {account.account_type === 'credit' ? 'Tarjeta' : 'Cuenta'} · {account.currency || 'PEN'}</option>)}</select></label>
          <label>Categoría de gasto<select required value={draft.category_id} onChange={event => change('category_id', event.target.value)}>{categories.filter(category => category.kind === 'expense').map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Modo<select value={draft.payment_mode} onChange={event => change('payment_mode', event.target.value)}><option value="manual">Manual</option><option value="automatic">Automático</option></select></label>
          {draft.payment_mode === 'automatic' && <label>Hora de Lima<input type="time" required value={draft.automatic_time} onChange={event => change('automatic_time', event.target.value)} /></label>}
        </fieldset> : <p>Se retirará este pago pendiente sin registrar un gasto ni cambiar tu saldo.</p>}
        {result && !result.success && <p role="alert" className={s.budgetEditorError}>{result.message}</p>}
        <div className={s.budgetActions}><button ref={cancel} type="button" className={s.quietButton} disabled={pending} onClick={() => setMode(null)}>{mode === 'delete' ? 'Conservar pago futuro' : 'Cancelar'}</button><button type="submit" className={s.button} disabled={pending}>{pending ? 'Guardando…' : mode === 'delete' ? 'Sí, eliminar' : 'Guardar cambios'}</button></div>
      </form>
    </MovementModal>
  </>;
}
