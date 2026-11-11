'use client';

import { useActionState, useState } from 'react';
import { addHabit, addPersonalReward, completeHabit, redeemReward } from './actions';

type Habit = { id: string; name: string; is_default: number; active: number; completed_on: string | null; earned_points: number | null };
type Completion = { habit_id: string; completed_on: string; points: number };
type Reward = { id: string; name: string; cost_points: number };
type Data = { habits: Habit[]; history: Completion[]; rewards: Reward[]; points: number; earned: number; spent: number; redeemedThisWeek: boolean };
const emptyState = { message: '', success: false };
const shiftDay = (value: string, offset: number) => { const date = new Date(`${value}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10); };
const shortDay = (value: string) => new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

function HabitCard({ habit, day, completed }: { habit: Habit; day: string; completed: boolean }) {
  const [state, action, pending] = useActionState(completeHabit, emptyState);
  return <article className={`habit-card ${completed ? 'done' : ''}`}>
    <div className="habit-card-copy"><span className="habit-check" aria-hidden="true">{completed ? '✓' : '○'}</span><div><h3>{habit.name}</h3><p>{completed ? 'Cumplido este día' : 'Cada día que lo logras suma 10 puntos'}</p></div></div>
    {completed ? <span className="habit-earned">+10 pts</span> : <form action={action}><input type="hidden" name="habit_id" value={habit.id} /><input type="hidden" name="day" value={day} /><button className="habit-mark" disabled={pending}>{pending ? 'Guardando…' : 'Lo cumplí · +10'}</button></form>}
    {state.message && <p role="status" className="habit-message">{state.message}</p>}
  </article>;
}

function RewardCard({ reward, points, redeemedThisWeek }: { reward: Reward; points: number; redeemedThisWeek: boolean }) {
  const [state, action, pending] = useActionState(redeemReward, emptyState);
  const canRedeem = points >= reward.cost_points && !redeemedThisWeek;
  return <article className="reward-card"><div className="reward-card-title"><span aria-hidden="true">✧</span><div><h3>{reward.name}</h3><p>Recompensa personal · sin valor monetario</p></div><strong>{reward.cost_points} pts</strong></div><form action={action}><input type="hidden" name="reward_id" value={reward.id} /><button className="reward-redeem" disabled={!canRedeem || pending}>{pending ? 'Canjeando…' : redeemedThisWeek ? 'Canje semanal usado' : points < reward.cost_points ? `Te faltan ${reward.cost_points - points} pts` : 'Canjear recompensa'}</button></form>{state.message && <p role="status" className="habit-message">{state.message}</p>}</article>;
}

export default function HabitsRewards({ data, today }: { data: Data; today: string }) {
  const [day, setDay] = useState(today);
  const [habitState, habitAction, habitPending] = useActionState(addHabit, emptyState);
  const [rewardState, rewardAction, rewardPending] = useActionState(addPersonalReward, emptyState);
  const week = Array.from({ length: 7 }, (_, index) => shiftDay(today, index - 6));
  const completed = new Set(data.history.filter(item => item.completed_on.slice(0, 10) === day).map(item => item.habit_id));
  const markedOnDay = data.history.filter(item => item.completed_on.slice(0, 10) === day).length;
  return <section className="panel habits-panel" id="habitos">
    <div className="panel-heading"><div><span className="eyebrow">HÁBITOS QUE SUMAN</span><h2>Tu bienestar, día a día</h2><p>Marca lo que cumpliste. Cada hábito suma puntos para tus recompensas personales.</p></div><div className="points-total"><strong>{data.points}</strong><span>puntos disponibles</span></div></div>
    <div className="habit-day-select"><div><strong>Elige el día</strong><span>Registra hoy o uno de los últimos siete días.</span></div><div className="habit-day-list">{week.map(date => <button type="button" key={date} className={date === day ? 'habit-day active' : 'habit-day'} onClick={() => setDay(date)} aria-pressed={date === day}>{date === today ? 'Hoy' : shortDay(date)}</button>)}</div></div>
    <div className="habit-progress-line"><span>{markedOnDay} de {data.habits.length} hábitos cumplidos</span><strong>+{markedOnDay * 10} puntos del día</strong></div>
    <div className="habit-list">{data.habits.map(habit => <HabitCard key={habit.id} habit={habit} day={day} completed={completed.has(habit.id)} />)}</div>
    <form action={habitAction} className="habit-create-form"><label>Añadir otro hábito<input name="name" required maxLength={80} placeholder="Ej. Practiqué guitarra" /></label><button className="secondary" disabled={habitPending}>{habitPending ? 'Guardando…' : 'Añadir hábito'}</button><p role="status">{habitState.message || 'Cada hábito completado vale 10 puntos.'}</p></form>
    <div className="rewards-section"><div className="panel-heading"><div><h2>Mis recompensas</h2><p>Canjea una recompensa personal por semana cuando tengas puntos suficientes.</p></div><span className="private-panel-icon goal-panel-icon" aria-hidden="true">✧</span></div>
      <form action={rewardAction} className="reward-create-form"><label>Nombre de recompensa<input name="name" maxLength={100} required placeholder="Ej. Tarde de películas" /></label><label>Cuesta (puntos)<input name="cost_points" type="number" min="10" max="999999" step="1" required placeholder="60" /></label><button className="secondary" disabled={rewardPending}>{rewardPending ? 'Guardando…' : 'Crear recompensa'}</button><p role="status">{rewardState.message || 'Los puntos son virtuales y no representan dinero.'}</p></form>
      <div className="rewards-list">{data.rewards.map(reward => <RewardCard key={reward.id} reward={reward} points={data.points} redeemedThisWeek={data.redeemedThisWeek} />)}{!data.rewards.length && <p className="empty">Aún no has creado recompensas personales.</p>}</div>
      <p className="points-history">Acumulados: {data.earned} pts · Canjeados: {data.spent} pts</p>
    </div>
  </section>;
}
