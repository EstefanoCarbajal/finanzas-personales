'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import CategoryIcon from './category-icon';
import palette from './category-color.module.css';
import { categoryIconFor, categoryToneFor } from '@/lib/category-icons.mjs';
import type { CategoryItem, RemoveCategory } from './categories-section';
import s from './account-actions.module.css';

export default function CategoryDeleteDialog({ category, remove, onClose, onRemoved, onBusy }: { category: CategoryItem; remove: RemoveCategory; onClose: () => void; onRemoved: (message: string) => void; onBusy: (busy: boolean) => void }) {
  const dialog = useRef<HTMLDialogElement>(null), cancel = useRef<HTMLButtonElement>(null);
  const backdrop = useRef(false);
  const title = useId(), description = useId();
  const [pending, setPending] = useState(false), [message, setMessage] = useState('');
  useEffect(() => {
    const node = dialog.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden'; cancel.current?.focus();
    return () => { node.close(); document.body.style.overflow = overflow; if (trigger?.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return;
    setPending(true); onBusy(true); setMessage('');
    try { const result = await remove(category.id); if (result.success) onRemoved(result.message); else setMessage(result.message); }
    catch { setMessage('No pudimos eliminar la categoría. Inténtalo otra vez.'); }
    finally { setPending(false); onBusy(false); }
  }
  return <dialog ref={dialog} className={s.dialog} aria-labelledby={title} aria-describedby={description} aria-busy={pending} onCancel={event => { event.preventDefault(); if (!pending) onClose(); }} onPointerDown={event => { backdrop.current = event.target === event.currentTarget; }} onClick={event => { if (backdrop.current && event.target === event.currentTarget && !pending) onClose(); backdrop.current = false; }}>
    <div className={s.surface}><header className={s.header}><span className={`${s.symbol} ${s.removeSymbol}`} aria-hidden="true">−</span><h2 id={title}>¿Eliminar categoría?</h2><button type="button" aria-label="Cerrar eliminación de categoría" disabled={pending} onClick={onClose}>×</button></header>
      <div className={s.accountPreview}><span className={palette.tone} data-tone={categoryToneFor(category)} aria-hidden="true"><CategoryIcon id={categoryIconFor(category)} /></span><div><strong>{category.name}</strong><small>{category.kind === 'income' ? 'Ingreso' : 'Gasto'}</small></div></div>
      <p id={description} className={s.description}>Solo puedes eliminar categorías sin movimientos, presupuestos ni pagos asociados.</p>
      <form onSubmit={submit}><p role="status" className={s.message}>{message}</p><div className={s.footer}><button ref={cancel} type="button" disabled={pending} onClick={onClose}>Conservar categoría</button><button type="submit" className={s.deleteButton} disabled={pending}>{pending ? 'Eliminando…' : 'Eliminar categoría'}</button></div></form>
    </div>
  </dialog>;
}
