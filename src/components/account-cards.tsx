'use client';

import { useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { soles } from '@/lib/money.mjs';
import type { Account } from './accounts-workspace';
import s from './accounts.module.css';

export default function AccountCards({ accounts, balances, saveOrder, creationCard }: { accounts: Account[]; balances: Record<string, string>; saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>; creationCard: ReactNode }) {
  const [order, setOrder] = useState<string[]>(() => [...accounts].sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity)).map(account => account.id));
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [saving, setSaving] = useState(false);
  const drag = useRef<string | null>(null);
  const latestOrder = useRef(order);
  const savedOrder = useRef(order);
  const savingRef = useRef(false);
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

  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0 || savingRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = id;
    setDragging(id);
  }

  function track(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-account-card]');
    if (target?.dataset.accountCard) move(drag.current, target.dataset.accountCard);
  }

  function finish(cancelled = false) {
    if (!drag.current) return;
    drag.current = null; setDragging(null);
    if (cancelled) { latestOrder.current = savedOrder.current; setOrder(savedOrder.current); }
    else void persist();
  }

  return <>
    <div className={s.accountGrid}>
      {ordered.map((account, index) => {
        const amount = balances[account.id] || '0.00';
        const tone = accounts.findIndex(item => item.id === account.id) % 3;
        return <article data-account-card={account.id} key={account.id} className={`${s.accountCard} ${s[`tone${tone}`]} ${dragging === account.id ? s.dragging : ''}`}>
          <div className={s.cardTop}><span className={s.cardBrand}><span className={s.brandMark}>✦</span> MI CUENTA</span><button type="button" className={s.dragHandle} disabled={saving} aria-label={`Arrastrar ${account.name} para ordenar`} onPointerDown={event => start(event, account.id)} onPointerMove={track} onPointerUp={() => finish()} onPointerCancel={() => finish(true)} onLostPointerCapture={() => finish(true)}><span aria-hidden="true">⠿</span></button></div>
          <div className={s.cardMiddle}><span className={s.cardChip} aria-hidden="true"><i /></span><span className={s.contactless} aria-hidden="true">)))</span></div>
          <div className={s.cardBottom}><div className={s.accountCopy}><h3>{account.name}</h3><span className={s.balanceLabel}>SALDO DISPONIBLE</span><strong className={`${s.accountBalance} ${amount.startsWith('-') ? s.negative : ''}`}>{soles(amount)}</strong></div><div className={s.orderControls}><button type="button" aria-label={`Mover ${account.name} antes`} disabled={saving || index === 0} onClick={() => { move(account.id, ordered[index - 1].id); void persist(); }}>←</button><button type="button" aria-label={`Mover ${account.name} después`} disabled={saving || index === ordered.length - 1} onClick={() => { move(account.id, ordered[index + 1].id); void persist(); }}>→</button></div></div>
        </article>;
      })}
      {creationCard}
    </div>
    <p className={s.orderNote} role="status" aria-live="polite">{saving ? 'Guardando orden…' : announcement}</p>
  </>;
}
