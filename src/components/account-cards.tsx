'use client';

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { soles } from '@/lib/money.mjs';
import type { Account } from './accounts-workspace';
import s from './accounts.module.css';
import AccountActions, { type RenameAccount, type RemoveAccount } from './account-actions';

export default function AccountCards({ accounts, balances, freeBalances, saveOrder, toggleSummaryAccount, creationCard, renameAccount, removeAccount, onOpenAccount }: { accounts: Account[]; balances: Record<string, string>; freeBalances: Record<string, string>; saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>; toggleSummaryAccount: (id: string, selected: boolean) => Promise<{ success: boolean; message: string }>; creationCard: ReactNode; renameAccount: RenameAccount; removeAccount: RemoveAccount; onOpenAccount: (id: string) => void }) {
  const [order, setOrder] = useState<string[]>(() => [...accounts].sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity)).map(account => account.id));
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [saving, setSaving] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; pointerId: number; x: number; y: number; lastX: number; lastY: number; left: number; top: number; active: boolean } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const latestOrder = useRef(order);
  const savedOrder = useRef(order);
  const savingRef = useRef(false);
  const mutationRef = useRef(false);
  const [mutating, setMutating] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const removedFocus = useRef<string | null>(null);
  const [focusRevision, setFocusRevision] = useState(0);
  const sortHelpId = useId();
  const ordered = [...order.map(id => accounts.find(account => account.id === id)).filter((account): account is Account => !!account), ...accounts.filter(account => !order.includes(account.id))];

  function move(id: string, target: string) {
    if (id === target) return;
    const ids = [...latestOrder.current.filter(item => accounts.some(account => account.id === item)), ...accounts.filter(account => !latestOrder.current.includes(account.id)).map(account => account.id)];
    const from = ids.indexOf(id), to = ids.indexOf(target);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, id);
    latestOrder.current = ids;
    setOrder(ids);
    const name = accounts.find(account => account.id === id)?.name;
    setAnnouncement(`${name} ahora está en la posición ${to + 1} de ${ids.length}.`);
  }

  async function persist() {
    const ids = latestOrder.current;
    if (ids.join(',') === savedOrder.current.join(',')) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const result = await saveOrder(ids);
      if (!result.success) throw new Error(result.message);
      savedOrder.current = ids;
      setAnnouncement(result.message);
    } catch (error) {
      latestOrder.current = savedOrder.current;
      setOrder(savedOrder.current);
      setAnnouncement(error instanceof Error ? error.message : 'No pudimos guardar el orden.');
    } finally { savingRef.current = false; setSaving(false); }
  }

  async function toggleSummary(id: string, selected: boolean) {
    if (savingRef.current || mutationRef.current || toggling) return;
    mutationRef.current = true;
    setMutating(true);
    setToggling(id);
    try {
      const result = await toggleSummaryAccount(id, selected);
      if (!result.success) throw new Error(result.message);
      setAnnouncement(result.message);
    } catch (error) { setAnnouncement(error instanceof Error ? error.message : 'No pudimos actualizar el resumen.'); }
    finally { mutationRef.current = false; setMutating(false); setToggling(null); }
  }

  function updateOffset() {
    const current = drag.current;
    const card = grid.current?.querySelector<HTMLElement>(`[data-account-card="${current?.id}"]`);
    if (!current?.active || !card || !grid.current) return;
    const left = Math.min(Math.max(0, current.left + current.lastX - current.x), grid.current.clientWidth - card.offsetWidth);
    const top = Math.min(Math.max(0, current.top + current.lastY - current.y), grid.current.clientHeight - card.offsetHeight);
    setOffset({ x: left - card.offsetLeft, y: top - card.offsetTop });
  }

  useLayoutEffect(() => { updateOffset(); }, [order, dragging]);
  useLayoutEffect(() => {
    if (removedFocus.current && !accounts.some(account => account.id === removedFocus.current)) {
      grid.current?.querySelector<HTMLElement>('[data-account-card], summary')?.focus({ preventScroll: true });
      removedFocus.current = null;
    }
  }, [accounts, focusRevision]);

  function start(event: PointerEvent<HTMLElement>, id: string) {
    if (event.button !== 0 || !event.isPrimary || savingRef.current || mutationRef.current || drag.current || (event.target instanceof Element && event.target.closest('[data-account-actions]'))) return;
    event.currentTarget.focus({ preventScroll: true });
    drag.current = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, left: event.currentTarget.offsetLeft, top: event.currentTarget.offsetTop, active: false };
    // Capture on the stable grid so DOM reordering never interrupts the gesture.
    grid.current?.setPointerCapture(event.pointerId);
  }

  function track(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.lastX = event.clientX; current.lastY = event.clientY;
    if (!current.active && Math.hypot(current.lastX - current.x, current.lastY - current.y) < 6) return;
    if (!current.active) { current.active = true; setDragging(current.id); }
    const target = document.elementsFromPoint(event.clientX, event.clientY).map(element => element.closest<HTMLElement>('[data-account-card]')).find(card => card?.dataset.accountCard !== current.id && card?.dataset.accountCard);
    if (target?.dataset.accountCard) move(current.id, target.dataset.accountCard);
    updateOffset();
  }

  function finish(cancelled = false) {
    const current = drag.current;
    if (!current) return;
    drag.current = null; setDragging(null); setOffset({ x: 0, y: 0 });
    if (grid.current?.hasPointerCapture(current.pointerId)) grid.current.releasePointerCapture(current.pointerId);
    if (cancelled) { latestOrder.current = savedOrder.current; setOrder(savedOrder.current); }
    else if (current.active) void persist();
    else onOpenAccount(current.id);
  }

  return <>
    <div ref={grid} data-account-grid className={s.accountGrid} onPointerMove={track} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}>
      {ordered.map((account, index) => {
        const amount = balances[account.id] || '0.00';
        const freeAmount = freeBalances[account.id] || amount;
        const tone = accounts.findIndex(item => item.id === account.id) % 3;
        const selected = account.summary_selected !== false;
        return <article data-account-card={account.id} key={account.id} role="group" tabIndex={0} aria-label={`Cuenta ${account.name}`} aria-roledescription="Cuenta ordenable" aria-disabled={saving || mutating || undefined} aria-describedby={sortHelpId} onPointerDown={event => start(event, account.id)} style={dragging === account.id ? { '--drag-x': `${offset.x}px`, '--drag-y': `${offset.y}px` } as CSSProperties : undefined} className={`${s.accountCard} ${s[`tone${tone}`]} ${dragging === account.id ? s.dragging : ''}`} onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'Escape' && drag.current) { event.preventDefault(); finish(true); return; }
            if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!savingRef.current && !mutationRef.current) onOpenAccount(account.id); return; }
            const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : 0;
            if (!direction) return;
            event.preventDefault();
            const target = ordered[index + direction];
            if (!savingRef.current && !mutationRef.current && !drag.current && target) { move(account.id, target.id); void persist(); }
          }}>
          <div className={s.cardTop}><span className={s.cardBrand}><button type="button" className={`${s.brandMark} ${selected ? s.brandMarkSelected : ''}`} aria-label={`${selected ? 'Quitar' : 'Añadir'} ${account.name} ${selected ? 'del' : 'al'} total de cuentas`} aria-pressed={selected} disabled={saving || mutating || !!dragging} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); void toggleSummary(account.id, !selected); }}>{toggling === account.id ? '·' : selected ? <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-9" /></svg> : <span aria-hidden="true">+</span>}</button><span>{selected ? 'INCLUIDA EN TOTAL' : 'EXCLUIDA DEL TOTAL'}</span></span><AccountActions account={account} balance={amount} disabled={saving || mutating || !!dragging} rename={renameAccount} remove={removeAccount} onBusy={busy => { mutationRef.current = busy; setMutating(busy); }} onResult={(message, removedId) => { setAnnouncement(message); if (removedId) { removedFocus.current = removedId; setFocusRevision(value => value + 1); } }} /></div>
          <div className={s.cardBottom}><div className={s.accountCopy}><h3>{account.name} <small aria-label={`Moneda ${account.currency || 'PEN'}`}>{account.currency || 'PEN'}</small></h3><strong className={`${s.accountBalance} ${freeAmount.startsWith('-') ? s.negative : ''}`}>{account.currency === 'USD' ? `$ ${freeAmount}` : soles(freeAmount)}</strong></div></div>
          <button type="button" className={s.openAccount} disabled={saving || mutating || !!dragging} onPointerDown={event => event.stopPropagation()} onClick={() => onOpenAccount(account.id)} aria-label={`Ver movimientos y alcancías de ${account.name}`}>Movimientos y alcancías</button>
        </article>;
      })}
      {creationCard}
    </div>
    <span id={sortHelpId} className={s.srOnly}>Pulsa Enter para ver movimientos y alcancías. Arrastra la tarjeta o usa las flechas para ordenar. Escape cancela el arrastre.</span>
    <p className={s.orderNote} role="status" aria-live="polite">{saving ? 'Guardando orden…' : announcement}</p>
  </>;
}
