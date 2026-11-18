'use client';

import { useId, useRef, useState } from 'react';
import s from './notification-center.module.css';

function Bell({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M13 20c0-7 4-12 11-12s11 5 11 12v7c0 3 1.5 5 3.5 7H9.5c2-2 3.5-4 3.5-7v-7Z" fill="currentColor" fillOpacity=".13" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M20 38a4 4 0 0 0 8 0M24 5v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}

export default function NotificationCenter() {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return <>
    <button ref={trigger} type="button" className={s.trigger} popoverTarget={id} aria-controls={id} aria-expanded={open} aria-label="Abrir notificaciones">
      <Bell className={s.triggerBell} /><span className={s.triggerShine} aria-hidden="true">✦</span>
    </button>
    <div ref={panel} id={id} popover="auto" className={s.panel} aria-labelledby={`${id}-title`} onToggle={event => setOpen(event.newState === 'open')}>
      <div className={s.heading}>
        <div><span className={s.eyebrow}>TU ESPACIO, AL DÍA</span><h2 id={`${id}-title`}>Notificaciones <span>✦</span></h2></div>
        <button type="button" className={s.close} aria-label="Cerrar notificaciones" onClick={() => { panel.current?.hidePopover(); trigger.current?.focus(); }}>×</button>
      </div>
      <div className={s.scene} aria-hidden="true">
        <span className={s.orbitOne} /><span className={s.orbitTwo} />
        <span className={s.starOne}>✦</span><span className={s.starTwo}>✧</span><span className={s.starThree}>✦</span>
        <span className={s.bellTile}><Bell /></span>
      </div>
      <div className={s.message}><span className={s.tag}>PRÓXIMAMENTE</span><h3>Un espacio para estar al tanto.</h3><p>Aquí podrás consultar tus avisos cuando las notificaciones estén disponibles.</p></div>
      <div className={s.footer}><span aria-hidden="true">✧</span> Todo lo importante, en un solo lugar</div>
    </div>
  </>;
}
