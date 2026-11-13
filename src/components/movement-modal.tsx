'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import s from './movement-modal.module.css';

export default function MovementModal({ open, onClose, pending = false, demo = false, children }: {
  open: boolean; onClose: () => void; pending?: boolean; demo?: boolean; children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const backdropPress = useRef(false);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  return <dialog ref={dialog} className={s.dialog} aria-labelledby={title} aria-busy={pending}
    onCancel={event => { event.preventDefault(); if (!pending) onClose(); }}
    onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
    onClick={event => { if (backdropPress.current && event.target === event.currentTarget && !pending) onClose(); backdropPress.current = false; }}>
    <div className={s.surface}>
      <header className={s.heading}>
        <span className={s.mark} aria-hidden="true"><img src="/koala.svg" width="48" height="48" alt="" /><span>＋</span></span>
        <div><span className={s.eyebrow}>{demo ? 'MODO DEMO' : 'UN PASO MÁS'}</span><h2 id={title}>Nuevo movimiento</h2></div>
        <button type="button" className={s.close} onClick={onClose} disabled={pending} aria-label="Cerrar formulario"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </header>
      {children}
    </div>
  </dialog>;
}
