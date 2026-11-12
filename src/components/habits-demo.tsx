'use client';

import { useState, type FormEvent } from 'react';
import HabitsBoard, { HabitTile, RewardTile, shiftHabitDay, type HabitData, type Reward } from './habits-board';
import s from './habits-board.module.css';

const today = '2026-11-11';
const names = ['Tomé agua', 'Alcancé mis pasos diarios', 'Leí mis páginas', 'Ahorré hoy', 'Comí saludable'];
const initial: HabitData = {
  habits: names.map((name, index) => ({ id: String(index), name })),
  history: [{ habit_id: '0', completed_on: today, points: 10 }, { habit_id: '2', completed_on: today, points: 10 }, ...[1, 2, 3].flatMap(offset => ['0', '1'].map(habit_id => ({ habit_id, completed_on: shiftHabitDay(today, -offset), points: 10 })))],
  rewards: [{ id: 'movie', name: 'Una tarde de películas', cost_points: 60 }, { id: 'rest', name: 'Tiempo solo para mí', cost_points: 100 }, { id: 'adventure', name: 'Una escapada de fin de semana', cost_points: 250 }],
  points: 80, earned: 80, spent: 0, redeemedThisWeek: false,
};

export default function HabitsDemo() {
  const [data, setData] = useState(initial);
  const [day, setDay] = useState(today);
  const [notice, setNotice] = useState('');
  function complete(id: string) {
    setData(current => current.history.some(h => h.habit_id === id && h.completed_on === day) ? current : { ...current, history: [...current.history, { habit_id: id, completed_on: day, points: 10 }], points: current.points + 10, earned: current.earned + 10 });
    setNotice('¡Un paso más! Sumaste 10 puntos de ejemplo.');
  }
  function redeem(reward: Reward) {
    setData(current => current.redeemedThisWeek || current.points < reward.cost_points ? current : { ...current, points: current.points - reward.cost_points, spent: current.spent + reward.cost_points, redeemedThisWeek: true });
    setNotice(`Canje de ejemplo: ${reward.name}. ¡Disfrútalo!`);
  }
  function create(event: FormEvent<HTMLFormElement>, kind: 'habit' | 'reward') {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form);
    const name = String(input.get('name') || '').trim();
    const cost = Number(input.get('cost_points'));
    if (!name || name.length > (kind === 'habit' ? 80 : 100) || (kind === 'reward' && (!Number.isInteger(cost) || cost < 10 || cost > 999999))) return;
    const entries = kind === 'habit' ? data.habits : data.rewards;
    if (entries.some(item => item.name.toLocaleLowerCase('es-PE') === name.toLocaleLowerCase('es-PE'))) { setNotice('Ya tienes un elemento con ese nombre en la demo.'); return; }
    const id = crypto.randomUUID();
    setData(current => kind === 'habit' ? { ...current, habits: [...current.habits, { id, name }] } : { ...current, rewards: [...current.rewards, { id, name, cost_points: cost }] });
    setNotice(kind === 'habit' ? 'Hábito añadido a la demo.' : 'Recompensa añadida a la demo.');
    form.reset();
  }
  return <HabitsBoard data={data} today={today} day={day} onDayChange={setDay} notice={notice}
    renderHabit={(habit, completed, index) => <HabitTile key={habit.id} habit={habit} completed={completed} index={index} action={<button className={s.actionButton} onClick={() => complete(habit.id)} aria-label={`Marcar ${habit.name} como cumplido, sumar 10 puntos`}>Lo cumplí · +10</button>} />}
    renderReward={(reward, index) => <RewardTile key={reward.id} reward={reward} points={data.points} index={index} action={<button className={s.actionButton} aria-label={`Canjear ${reward.name}`} disabled={data.redeemedThisWeek || data.points < reward.cost_points} onClick={() => redeem(reward)}>{data.redeemedThisWeek ? 'Canje semanal usado' : data.points < reward.cost_points ? `Te faltan ${reward.cost_points - data.points} pts` : 'Disfrutar mi recompensa →'}</button>} />}
    habitForm={<form onSubmit={event => create(event, 'habit')} className={s.createForm}><label>Nombre del hábito<input name="name" required maxLength={80} placeholder="Ej. Practiqué guitarra" /></label><button className={s.actionButton}>Añadir hábito</button><p>Solo para explorar: hoy y los seis días anteriores. Los cambios se reinician al salir de esta sección o recargar.</p></form>}
    rewardForm={<form onSubmit={event => create(event, 'reward')} className={`${s.createForm} ${s.rewardForm}`}><label>Nombre de recompensa<input name="name" required maxLength={100} placeholder="Ej. Tarde de películas" /></label><label>Cuesta (puntos)<input name="cost_points" type="number" min="10" max="999999" step="1" required placeholder="60" /></label><button className={s.actionButton}>Crear recompensa</button><p>Recompensas de ejemplo. Un canje por semana; nada se guarda al salir de esta sección o recargar.</p></form>}
  />;
}
