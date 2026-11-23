'use client';

import { useEffect, useId, useRef, useState } from 'react';
import MovementModal from './movement-modal';
import type { SavingsGoal } from './goals-workspace';
import type { PlanningResult } from './planning-workspace';
import s from './planning-workspace.module.css';

export type ManageGoal = (id: string, mode: 'edit' | 'delete', input?: { name: string; target_amount: string; target_on: string | null }) => Promise<PlanningResult>;
export default function GoalControls({ goal, manage, demo, today }: { goal: SavingsGoal; manage: ManageGoal; demo: boolean; today: string }) {
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
    if (next === 'edit') { setAmount(goal.target_amount); setName(goal.name); setDate(goal.target_on || ''); }
    setMode(next);
  }
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);
  const [name, setName] = useState(goal.name);
  const [date, setDate] = useState(goal.target_on || '');
  const [amount, setAmount] = useState(goal.target_amount);
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
      const response = await manage(goal.id, mode, { name, target_amount: amount.replace(',', '.'), target_on: date || null });
      setResult(response);
      if (response.success) {
        setMode(null);
        if (mode === 'delete') document.getElementById('goal-heading')?.focus({ preventScroll: true });
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
      <button ref={trigger} type="button" className={s.budgetOptionsTrigger} aria-label={'Opciones de la meta ' + goal.name} aria-haspopup="menu" aria-expanded={menuOpen} aria-controls={menuOpen ? menuId : undefined} onClick={() => setMenuOpen(current => !current)}><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><circle cx="10" cy="4" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="10" cy="16" r="1.8" /></svg></button>
      {menuOpen && <div ref={menu} id={menuId} role="menu" aria-label={'Opciones de la meta ' + goal.name} className={s.budgetOptionsMenu}><button type="button" role="menuitem" onClick={() => choose('edit')}>Editar</button><button type="button" role="menuitem" className={s.budgetDeleteOption} onClick={() => choose('delete')}>Eliminar</button></div>}
    </div>
    {!mode && result && <p role="status">{result.message}</p>}
    <MovementModal open={!!mode} onClose={() => { if (!busy.current) setMode(null); }} pending={pending} demo={demo} heading={mode === 'delete' ? '¿Eliminar meta?' : 'Editar meta'}>
      <form className={s.budgetEditor} onSubmit={event => { event.preventDefault(); submit(); }}><p className={s.budgetEditorCategory}>{goal.name}</p>
        {mode === 'edit' ? <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 16, minWidth: 0 }}><label>Nombre<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></label><label>Objetivo (PEN)<input ref={input} required inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value.replace(',', '.'))} disabled={pending} /></label><label>Fecha objetivo (opcional)<input type="date" value={date} onChange={event => setDate(event.target.value)} min={goal.target_on && goal.target_on < today ? goal.target_on : today} max="9999-12-31" /></label><p>Cuenta de ahorro: {goal.account_name}</p></fieldset> : <p>Se eliminará esta meta de tu lista. Los aportes y transferencias se conservan; el dinero sigue en su cuenta.</p>}
        {result && !result.success && <p role="alert" className={s.budgetEditorError}>{result.message}</p>}
        <div className={s.budgetActions}><button ref={cancel} type="button" className={s.quietButton} disabled={pending} onClick={() => setMode(null)}>{mode === 'delete' ? 'Conservar meta' : 'Cancelar'}</button><button type="submit" className={s.button} disabled={pending}>{pending ? 'Guardando…' : mode === 'delete' ? 'Sí, eliminar' : 'Guardar cambios'}</button></div>
      </form>
    </MovementModal>
  </>;
}
