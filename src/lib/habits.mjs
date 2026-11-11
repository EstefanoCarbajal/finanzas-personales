import { randomUUID } from 'node:crypto';
import { todayLima } from './repository.mjs';

export class HabitInputError extends Error {}
export const POINTS_PER_HABIT = 10;
export const DEFAULT_HABITS = ['Tomé agua', 'Alcancé mis pasos diarios', 'Leí mis páginas', 'Ahorré hoy', 'Comí saludable'];
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
const validDay = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const shiftDay = (value, offset) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};
export function isoWeekKey(value) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const year = date.getUTCFullYear();
  const first = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((date - first) / 86400000) + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

async function ensureDefaults(pool, userId) {
  const [[row]] = await pool.execute('SELECT COUNT(*) AS total FROM habits WHERE user_id = ?', [userId]);
  if (Number(row.total)) return;
  for (const name of DEFAULT_HABITS) await pool.execute('INSERT IGNORE INTO habits (id, user_id, name, is_default) VALUES (?, ?, ?, TRUE)', [randomUUID(), userId, name]);
}

export async function createHabit(pool, userId, input) {
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 80) throw new HabitInputError('Escribe un hábito de hasta 80 caracteres.');
  try { await pool.execute('INSERT INTO habits (id, user_id, name) VALUES (?, ?, ?)', [randomUUID(), userId, input.name.trim()]); }
  catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HabitInputError('Ya tienes un hábito con ese nombre.'); throw error; }
}

export async function markHabitComplete(pool, userId, input) {
  if (!uuid(input.habit_id) || !validDay(input.day)) throw new HabitInputError('El hábito o día no es válido.');
  const today = todayLima();
  if (input.day > today || input.day < shiftDay(today, -6)) throw new HabitInputError('Solo puedes registrar hábitos de hoy o de los últimos siete días.');
  const [[habit]] = await pool.execute('SELECT id FROM habits WHERE user_id = ? AND id = ? AND active = TRUE', [userId, input.habit_id]);
  if (!habit) throw new HabitInputError('Este hábito no está disponible.');
  try { await pool.execute('INSERT INTO habit_completions (id, user_id, habit_id, completed_on, points) VALUES (?, ?, ?, ?, ?)', [randomUUID(), userId, habit.id, input.day, POINTS_PER_HABIT]); }
  catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HabitInputError('Ese hábito ya está marcado para este día.'); throw error; }
}

export async function createPersonalReward(pool, userId, input) {
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 100) throw new HabitInputError('Escribe una recompensa de hasta 100 caracteres.');
  const raw = typeof input.cost_points === 'string' ? input.cost_points : '';
  if (!/^\d{1,6}$/.test(raw) || Number(raw) < 10) throw new HabitInputError('El canje debe costar al menos 10 puntos.');
  try { await pool.execute('INSERT INTO personal_rewards (id, user_id, name, cost_points) VALUES (?, ?, ?, ?)', [randomUUID(), userId, input.name.trim(), Number(raw)]); }
  catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HabitInputError('Ya tienes una recompensa con ese nombre.'); throw error; }
}

export async function redeemPersonalReward(pool, userId, input) {
  if (!uuid(input.reward_id)) throw new HabitInputError('La recompensa seleccionada no es válida.');
  const today = todayLima(), week = isoWeekKey(today);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[reward]] = await connection.execute('SELECT id, cost_points FROM personal_rewards WHERE id = ? AND user_id = ? AND active = TRUE FOR UPDATE', [input.reward_id, userId]);
    if (!reward) throw new HabitInputError('La recompensa no está disponible.');
    const [[weekly]] = await connection.execute('SELECT id FROM reward_redemptions WHERE user_id = ? AND week_key = ? FOR UPDATE', [userId, week]);
    if (weekly) throw new HabitInputError('Ya canjeaste una recompensa esta semana.');
    const [[balance]] = await connection.execute(`SELECT
      COALESCE((SELECT SUM(points) FROM habit_completions WHERE user_id = ?), 0) AS earned,
      COALESCE((SELECT SUM(cost_points) FROM reward_redemptions WHERE user_id = ?), 0) AS spent`, [userId, userId]);
    if (Number(balance.earned) - Number(balance.spent) < Number(reward.cost_points)) throw new HabitInputError('Aún no tienes puntos suficientes para este canje.');
    await connection.execute('INSERT INTO reward_redemptions (id, user_id, reward_id, week_key, cost_points, redeemed_on) VALUES (?, ?, ?, ?, ?, ?)', [randomUUID(), userId, reward.id, week, reward.cost_points, today]);
    await connection.commit();
  } catch (error) { await connection.rollback(); if (error.code === 'ER_DUP_ENTRY') throw new HabitInputError('Ya canjeaste una recompensa esta semana.'); throw error; }
  finally { connection.release(); }
}

export async function readHabitDashboard(pool, userId, day = todayLima()) {
  await ensureDefaults(pool, userId);
  const start = shiftDay(day, -6), week = isoWeekKey(day);
  const [habits] = await pool.execute(`SELECT h.id, h.name, h.is_default, h.active, c.completed_on AS completed_on, c.points AS earned_points
    FROM habits h LEFT JOIN habit_completions c ON c.user_id = h.user_id AND c.habit_id = h.id AND c.completed_on = ?
    WHERE h.user_id = ? AND h.active = TRUE ORDER BY h.is_default DESC, h.created_at, h.name`, [day, userId]);
  const [history] = await pool.execute('SELECT habit_id, completed_on, points FROM habit_completions WHERE user_id = ? AND completed_on BETWEEN ? AND ? ORDER BY completed_on DESC', [userId, start, day]);
  const [[totals]] = await pool.execute(`SELECT COALESCE((SELECT SUM(points) FROM habit_completions WHERE user_id = ?), 0) AS earned,
    COALESCE((SELECT SUM(cost_points) FROM reward_redemptions WHERE user_id = ?), 0) AS spent`, [userId, userId]);
  const [[weekly]] = await pool.execute('SELECT id FROM reward_redemptions WHERE user_id = ? AND week_key = ?', [userId, week]);
  const [rewards] = await pool.execute('SELECT id, name, cost_points FROM personal_rewards WHERE user_id = ? AND active = TRUE ORDER BY cost_points, name', [userId]);
  return { habits, history, rewards, points: Number(totals.earned) - Number(totals.spent), earned: Number(totals.earned), spent: Number(totals.spent), redeemedThisWeek: Boolean(weekly) };
}
