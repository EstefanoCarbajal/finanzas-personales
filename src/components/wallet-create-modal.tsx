'use client';

import { createContext, useContext, useEffect, useId, useRef, type ReactNode } from 'react';
import s from './wallet-create-modal.module.css';

export const WalletCreateContext = createContext<{ finish: () => void; setPending: (value: boolean) => void } | null>(null);
export const useWalletCreate = () => useContext(WalletCreateContext);

export default function WalletCreateModal({ open, onClose, pending, kind, children }: { open: boolean; onClose: () => void; pending: boolean; kind: 'account' | 'credit'; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const backdrop = useRef(false);
  useEffect(() => {
    if (!open) return;
    const node = dialog.current!;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }); };
  }, [open]);
  return <dialog ref={dialog} className={s.dialog} aria-labelledby={title} aria-busy={pending}
    onCancel={event => { event.preventDefault(); if (!pending) onClose(); }}
    onPointerDown={event => { backdrop.current = event.target === event.currentTarget; }}
    onClick={event => { if (backdrop.current && event.target === event.currentTarget && !pending) onClose(); backdrop.current = false; }}>
    <div className={s.surface}>
      <header className={s.header}>
        {kind === 'account' && <div className={s.art} aria-hidden="true"><span className={s.spark}>✦</span><span className={s.artCard}><span className={s.artChip} /><span className={s.artLine}>••••</span></span><span className={s.plus}>＋</span></div>}
        <div><span className={s.eyebrow}>{kind === 'account' ? 'TU BILLETERA' : 'CATÁLOGO PERÚ · NOV 2026'}</span><h2 id={title}>{kind === 'account' ? 'Nueva cuenta' : 'Nueva tarjeta'}</h2>{kind === 'account' && <p>Un espacio para tu dinero.</p>}</div>
        <button type="button" className={s.close} onClick={onClose} disabled={pending} aria-label="Cerrar formulario">×</button>
      </header>
      <div className={s.body}>{children}</div>
    </div>
  </dialog>;
}
