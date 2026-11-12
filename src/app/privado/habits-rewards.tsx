'use client';

import { useActionState, useState } from 'react';
import { addHabit, addPersonalReward, completeHabit, redeemReward } from './actions';
import HabitsBoard, { HabitTile, RewardTile, type Habit, type Reward, type HabitData } from '@/components/habits-board';
import s from '@/components/habits-board.module.css';

const emptyState = { message: '', success: false };

function HabitCard({ habit, day, completed, index }: { habit: Habit; day: string; completed: boolean; index: number }) {
  const [state, action, pending] = useActionState(completeHabit, emptyState);
  return <HabitTile habit={habit} completed={completed} index={index} action={<>
    <form action={action}><input type="hidden" name="habit_id" value={habit.id} /><input type="hidden" name="day" value={day} /><button className={s.actionButton} aria-label={`Marcar ${habit.name} como cumplido, sumar 10 puntos`} disabled={pending}>{pending ? 'Guardando…' : 'Lo cumplí · +10'}</button></form>
    {state.message && <p role="status" className={s.message}>{state.message}</p>}
  </>} />;
}

function RewardCard({ reward, points, redeemedThisWeek, index }: { reward: Reward; points: number; redeemedThisWeek: boolean; index: number }) {
  const [state, action, pending] = useActionState(redeemReward, emptyState);
  const canRedeem = points >= reward.cost_points && !redeemedThisWeek;
  return <RewardTile reward={reward} points={points} index={index} action={<>
    <form action={action}><input type="hidden" name="reward_id" value={reward.id} /><button className={s.actionButton} aria-label={`Canjear ${reward.name}`} disabled={!canRedeem || pending}>{pending ? 'Canjeando…' : redeemedThisWeek ? 'Canje semanal usado' : points < reward.cost_points ? `Te faltan ${reward.cost_points - points} pts` : 'Disfrutar mi recompensa →'}</button></form>
    {state.message && <p role="status" className={s.message}>{state.message}</p>}
  </>} />;
}

export default function HabitsRewards({ data, today }: { data: HabitData; today: string }) {
  const [day, setDay] = useState(today);
  const [habitState, habitAction, habitPending] = useActionState(addHabit, emptyState);
  const [rewardState, rewardAction, rewardPending] = useActionState(addPersonalReward, emptyState);
  return <HabitsBoard data={data} today={today} day={day} onDayChange={setDay}
    renderHabit={(habit, completed, index) => <HabitCard key={`${day}-${habit.id}`} habit={habit} day={day} completed={completed} index={index} />}
    renderReward={(reward, index) => <RewardCard key={reward.id} reward={reward} points={data.points} redeemedThisWeek={data.redeemedThisWeek} index={index} />}
    habitForm={<form action={habitAction} className={s.createForm}><label>Nombre del hábito<input name="name" required maxLength={80} placeholder="Ej. Practiqué guitarra" /></label><button className={s.actionButton} disabled={habitPending}>{habitPending ? 'Guardando…' : 'Añadir hábito'}</button><p role="status">{habitState.message || 'Puedes registrar hoy y los seis días anteriores. Cada hábito suma 10 puntos una vez por día.'}</p></form>}
    rewardForm={<form action={rewardAction} className={`${s.createForm} ${s.rewardForm}`}><label>Nombre de recompensa<input name="name" maxLength={100} required placeholder="Ej. Tarde de películas" /></label><label>Cuesta (puntos)<input name="cost_points" type="number" min="10" max="999999" step="1" required placeholder="60" /></label><button className={s.actionButton} disabled={rewardPending}>{rewardPending ? 'Guardando…' : 'Crear recompensa'}</button><p role="status">{rewardState.message || 'Elige un premio personal desde 10 puntos. Máximo un canje por semana.'}</p></form>}
  />;
}
