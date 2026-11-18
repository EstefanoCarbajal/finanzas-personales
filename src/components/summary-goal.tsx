'use client';

import type { CSSProperties } from 'react';
import SelectedAvatar from './selected-avatar';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import s from './summary-goal.module.css';

export default function SummaryGoal({ goal, onOpen, demo = false }: {
  goal?: { name: string; saved: string; target_amount: string }; onOpen?: () => void; demo?: boolean;
}) {
  const saved = toCents(goal?.saved || '0.00');
  const target = toCents(goal?.target_amount || '0.00');
  const progress = target > BigInt(0) ? Math.min(100, Number(saved * BigInt(100) / target)) : 0;
  const complete = !!goal && saved >= target;
  const label = goal ? 'Ver mi meta' : 'Crear mi primera meta';
  return <section className={`${s.card} ${complete ? s.complete : ''}`} aria-label="Tu meta de ahorro">
    <div className={s.copy}><span className={s.eyebrow}>{complete ? '¡META ALCANZADA!' : 'TU PRÓXIMA VICTORIA'}{demo && <span> · Ejemplo</span>}</span>
      <h2>{goal?.name || 'Todo empieza con una meta'}</h2>
      {goal ? <><div className={s.amount}><strong>{soles(goal.saved)}</strong><span>de {soles(goal.target_amount)}</span></div><p>{complete ? '¡Llegaste! Cada aporte cuenta.' : `A ${soles(decimal(target - saved))} de lograrlo.`}</p></> : <p>Elige tu destino y empieza a avanzar.</p>}
      {onOpen ? <button className={s.link} onClick={onOpen}>{label}<span aria-hidden="true">↗</span></button> : <a className={s.link} href="/privado?seccion=planificacion#metas">{label}<span aria-hidden="true">↗</span></a>}
    </div>
    <div className={s.race}>
      <div className={s.raceTop}><span>{complete ? '¡Lo conseguiste!' : 'Cada paso te acerca'}</span><strong>{progress}%</strong></div>
      <div className={s.scene} aria-hidden="true"><span className={s.cloud}>✦</span><div className={s.course} style={{ '--position': `${progress}%` } as CSSProperties}>
        <div className={s.runner}><div className={s.character}><SelectedAvatar width={76} height={76} /><span className={s.legs}><i /><i /></span></div><span className={s.shadow} /></div>
        <div className={s.finish}><span>⚑</span><b>META</b></div>
      </div></div>
      <div className={s.track} role="progressbar" aria-label="Avance de tu meta" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={goal ? `${soles(goal.saved)} de ${soles(goal.target_amount)}` : 'Sin meta todavía'}><span style={{width:`${progress}%`}} /></div>
      <div className={s.milestones} aria-hidden="true"><span>Salida</span><span>25%</span><span>50%</span><span>75%</span><span>¡Llegada!</span></div>
    </div>
  </section>;
}
