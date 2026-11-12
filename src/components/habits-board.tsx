'use client';

import type { ReactNode } from 'react';
import s from './habits-board.module.css';

export type Habit = { id: string; name: string };
export type Reward = { id: string; name: string; cost_points: number };
export type HabitData = {
  habits: Habit[];
  history: { habit_id: string; completed_on: string; points: number }[];
  rewards: Reward[];
  points: number; earned: number; spent: number; redeemedThisWeek: boolean;
};
export const shiftHabitDay = (value: string, offset: number) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};
const dateFormat = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-PE', { ...options, timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const number = (value: number) => value.toLocaleString('es-PE');

function HabitIcon({ name }: { name: string }) {
  const text = name.toLowerCase();
  const path = /agua/.test(text) ? <><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/></> : /pasos|caminar/.test(text) ? <><path d="m9 4 3 4-2 5 4 3v5M5 20l3-6M12 8l4 3h4"/><circle cx="14" cy="4" r="2"/></> : /le[íe]|páginas/.test(text) ? <><path d="M12 6C9 4 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-2-1-6-1-9 1Zm0 0v14"/></> : /ahorr/.test(text) ? <><path d="M12 21V10M12 15C5 16 3 12 3 7c5 0 9 2 9 8ZM12 11c0-6 4-8 9-8 0 5-2 9-9 8Z"/></> : /salud|com[íe]/.test(text) ? <><path d="M5 19C1 9 9 3 21 3c0 12-6 20-16 16Zm0 0L16 8"/></> : <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{path}</svg>;
}

export function HabitTile({ habit, completed, action, index }: { habit: Habit; completed: boolean; action: ReactNode; index: number }) {
  return <article className={`${s.habit} ${completed ? s.done : ''}`}>
    <span className={`${s.habitIcon} ${s[`tone${index % 5}`]}`}><HabitIcon name={habit.name} /></span>
    <div className={s.habitCopy}><h3>{habit.name}</h3><p>{completed ? 'Un pequeño paso que ya cuenta.' : 'Un momento para cuidar de ti.'}</p></div>
    <div className={s.habitAction}>{completed ? <span className={s.completed}><span aria-hidden="true">✓</span> Cumplido <b>+10 pts</b></span> : action}</div>
  </article>;
}

export function RewardTile({ reward, points, action, index }: { reward: Reward; points: number; action: ReactNode; index: number }) {
  return <article className={s.reward}>
    <div className={`${s.rewardArt} ${s[`tone${index % 5}`]}`} aria-hidden="true"><span className={s.artSpark}>✦</span><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 28h36v26H14zM10 20h44v10H10zM32 20v34"/><path d="M32 20c-20 0-18-18-8-12 5 3 8 12 8 12Zm0 0c20 0 18-18 8-12-5 3-8 12-8 12Z"/></svg><i>✧</i></div>
    <div className={s.rewardBody}><span className={s.cost}>✧ {number(reward.cost_points)} puntos</span><h3>{reward.name}</h3><p>{points >= reward.cost_points ? 'Ya tienes los puntos para este premio.' : `A ${number(reward.cost_points - points)} puntos de hacerlo posible.`}</p><div className={s.rewardTrack}><i style={{ width: `${Math.min(100, points / reward.cost_points * 100)}%` }} /></div>{action}</div>
  </article>;
}

type Props = {
  data: HabitData; today: string; day: string; onDayChange: (day: string) => void;
  renderHabit: (habit: Habit, completed: boolean, index: number) => ReactNode;
  renderReward: (reward: Reward, index: number) => ReactNode;
  habitForm: ReactNode; rewardForm: ReactNode; notice?: string;
};

export default function HabitsBoard({ data, today, day, onDayChange, renderHabit, renderReward, habitForm, rewardForm, notice }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => shiftHabitDay(today, i - 6));
  const completed = new Set(data.history.filter(item => item.completed_on.slice(0, 10) === day).map(item => item.habit_id));
  const marked = data.habits.filter(h => completed.has(h.id)).length;
  const percent = data.habits.length ? Math.round(marked / data.habits.length * 100) : 0;
  const activeDays = new Set(data.history.map(item => item.completed_on.slice(0, 10))).size;
  return <div className={s.board} id="habitos">
    <div className={s.heroGrid}>
      <section className={s.hero} aria-labelledby="habits-hero-title"><div className={s.heroCopy}><span className={s.eyebrow}>PEQUEÑOS RITUALES. GRANDES CAMBIOS.</span><h2 id="habits-hero-title">Lo bueno empieza<br />por ti.</h2><p>No hace falta hacerlo todo. Cada hábito cumplido<br className={s.desktopBreak} /> es una pequeña victoria que merece contar.</p><span className={s.heroBadge}><span aria-hidden="true">✦</span> +10 puntos por cada hábito cumplido</span></div><div className={s.heroMascot} aria-hidden="true"><span>✧</span><img src="/koala.svg" alt=""/><b>¡Tú puedes!</b></div></section>
      <section className={s.wallet} aria-label="Tu saldo de puntos"><div className={s.walletHeading}><span>TU COLECCIÓN DE LOGROS</span><i aria-hidden="true">✧</i></div><strong aria-live="polite">{number(data.points)}<small>puntos disponibles</small></strong><div className={s.walletStats}><span><b>{number(data.earned)}</b> ganados</span><span><b>{number(data.spent)}</b> canjeados</span></div><p>Se ganan con constancia. Se disfrutan a tu manera.</p></section>
    </div>
    <p role="status" className={s.notice}>{notice}</p>
    <div className={s.routineGrid}>
      <section className={s.routine} aria-labelledby="routine-title"><div className={s.sectionHeading}><div><span className={s.kicker}>UN DÍA A LA VEZ</span><h2 id="routine-title">Tu espacio para crecer</h2></div><span className={s.period}>Últimos 7 días</span></div>
        <div className={s.week} aria-label="Elige el día para registrar tus hábitos">{days.map(date => {
          const count = new Set(data.history.filter(item => item.completed_on.slice(0, 10) === date).map(item => item.habit_id)).size;
          return <button key={date} className={day === date ? s.selectedDay : ''} onClick={() => onDayChange(date)} aria-pressed={day === date} aria-label={`${date === today ? 'Hoy, ' : ''}${dateFormat(date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${count} hábitos cumplidos`}><span>{date === today ? 'Hoy' : dateFormat(date, { weekday: 'short' }).replace('.', '')}</span><strong>{dateFormat(date, { day: 'numeric' })}</strong><i className={count ? s.dayDotFilled : ''} /></button>;
        })}</div>
        <div className={s.dayTitle}><h3>{day === today ? 'Tus hábitos de hoy' : dateFormat(day, { weekday: 'long', day: 'numeric', month: 'long' })}</h3><span>{marked}/{data.habits.length} cumplidos</span></div>
        <div className={s.habits}>{data.habits.map((habit, index) => renderHabit(habit, completed.has(habit.id), index))}</div>
        {!data.habits.length && <p className={s.empty}>Tu rutina empieza con algo pequeño. Añade tu primer hábito.</p>}
        <details className={s.addDetails}><summary><span aria-hidden="true">＋</span> Añadir un hábito personal</summary>{habitForm}</details>
      </section>
      <aside className={s.progressCard} aria-label="Progreso del día seleccionado"><span className={s.kicker}>CADA PASO SUMA</span><h2>{percent === 100 && data.habits.length ? '¡Lo lograste!' : 'Avanza a tu ritmo.'}</h2><div className={s.ring} style={{ background: `conic-gradient(#a6d75d ${percent}%, #e8efda 0)` }} role="img" aria-label={`${marked} de ${data.habits.length} hábitos cumplidos, ${percent}%`}><div><strong>{percent}<small>%</small></strong><span>del día completado</span></div></div><span className={s.dayPoints}>✧ +{marked * 10} puntos este día</span><p>{percent === 100 && data.habits.length ? 'Hoy te elegiste a ti. Disfruta de lo que has conseguido.' : 'La constancia se construye con pequeños momentos, no con días perfectos.'}</p><div className={s.weekStat}><span aria-hidden="true">↗</span><div><strong>{activeDays} de 7 días</strong><small>con hábitos registrados</small></div></div></aside>
    </div>
    <section className={s.rewardsSection} aria-labelledby="rewards-title"><div className={s.sectionHeading}><div><span className={s.kicker}>TAMBIÉN MERECES DISFRUTAR</span><h2 id="rewards-title">Un premio a tu esfuerzo.</h2><p>Elige algo que te haga bien. Puedes canjear una recompensa por semana.</p></div><span className={`${s.weekBadge} ${data.redeemedThisWeek ? s.usedBadge : ''}`}>{data.redeemedThisWeek ? '✓ Canje semanal usado' : '✧ Canje semanal disponible'}</span></div>
      <div className={s.rewards}>{data.rewards.map(renderReward)}{!data.rewards.length && <div className={s.empty}><span aria-hidden="true">✧</span><h3>¿Qué te gustaría regalarte?</h3><p>Crea tu primera recompensa: una tarde libre, una película o tiempo para ti.</p></div>}</div>
      <details className={s.addDetails}><summary><span aria-hidden="true">＋</span> Crear una recompensa personal</summary>{rewardForm}</details>
    </section>
    <p className={s.footnote}>Tus puntos son virtuales y no representan dinero. Si un premio implica un pago, regístralo como gasto cuando lo realices.</p>
  </div>;
}
