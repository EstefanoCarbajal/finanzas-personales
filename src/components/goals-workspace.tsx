'use client';

import type { ReactNode } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import VacationAvatar from './vacation-avatar';
import s from './goals-workspace.module.css';

export type SavingsGoal = { id: string; name: string; target_amount: string; saved: string; target_on: string | null; account_id: string; account_name: string };
const dateLabel = (value: string) => new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

function Summit({ complete = false }: { complete?: boolean }) {
  return <svg viewBox="0 0 280 170" fill="none" aria-hidden="true" className={s.summit}>
    <circle cx="210" cy="49" r="27" fill="currentColor" opacity=".14" />
    <circle cx="210" cy="49" r="17" fill="currentColor" opacity=".5" />
    <path d="M22 144 88 62l48 62 42-89 83 109Z" fill="currentColor" opacity=".13" />
    <path d="m68 145 81-110 80 110Z" fill="currentColor" opacity=".28" />
    <path d="m149 35-21 29 20-6 15 8Z" fill="currentColor" opacity=".75" />
    <path d="M149 35V11m0 0h28l-7 8 7 8h-28" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <path d="M134 143c31-26-32-20-4-44s25-18 19-29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7" />
    <path d="M24 146h236M44 45v12m-6-6h12m181 46v12m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
    {complete && <path d="m193 87 8 8 17-20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
}

export function SavingsGoalCard({ goal, children }: { goal: SavingsGoal; children?: ReactNode }) {
  const target = toCents(goal.target_amount), saved = toCents(goal.saved);
  const complete = saved >= target;
  const percentage = Math.min(100, Number(saved * BigInt(100) / target));
  return <article className={`${s.card} ${complete ? s.completed : ''}`}>
    <div className={s.cardArt}><span className={s.badge}>{complete ? '✓ Meta alcanzada' : 'En camino'}</span><VacationAvatar className={s.cardAvatar} sizes="138px" /><span className={s.artNumber} aria-hidden="true">{String(percentage).padStart(2, '0')}<small>%</small></span></div>
    <div className={s.cardBody}>
      <h3>{goal.name}</h3><div className={s.account}><span aria-hidden="true">↳</span> {goal.account_name}</div>
      <div className={s.amount}><strong>{soles(goal.saved)}</strong><span>de {soles(goal.target_amount)}</span></div>
      <progress className={s.progress} aria-label={`Avance de ${goal.name}: ${percentage}%`} value={percentage} max={100} />
      <div className={s.cardMeta}><span>{complete ? '¡Lo conseguiste!' : <>Faltan <b>{soles(decimal(target - saved))}</b></>}</span><span>{goal.target_on ? dateLabel(goal.target_on) : 'Sin fecha límite'}</span></div>
      {children}
    </div>
  </article>;
}

export default function GoalsWorkspace({ goals, creation, children, demo = false }: { goals: SavingsGoal[]; creation?: ReactNode; children: ReactNode; demo?: boolean }) {
  return <section className={s.workspace} aria-label="Metas de ahorro">
    <div className={s.sectionHeading}><h2>Tus metas</h2>{demo && <span className={s.demoLabel}>Vista ilustrativa</span>}</div>
    {creation}
    <div className={s.grid}>{children}{!goals.length && <div className={s.empty}><Summit /><h3>¿Qué quieres hacer realidad?</h3><p>Crea tu primera meta y empieza a acercarte.</p></div>}</div>
    {demo && <p className={s.demoFoot}>Crea metas y registra aportes en tu espacio privado.</p>}
  </section>;
}
