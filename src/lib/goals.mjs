import { randomUUID } from 'node:crypto';
import { decimal, toCents } from './money.mjs';
import { todayLima } from './repository.mjs';

export class GoalInputError extends Error {}
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const amountValue = value => {
  try { const cents = toCents(value); if (cents <= 0n) throw new Error(); return decimal(cents); }
  catch { throw new GoalInputError('Introduce un importe mayor que cero, con hasta dos decimales.'); }
};

export async function createGoal(pool, userId, input) {
  if (!uuid(input.account_id)) throw new GoalInputError('Elige una cuenta de ahorro válida.');
  if (typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 100) throw new GoalInputError('Escribe un nombre de meta de hasta 100 caracteres.');
  const target = amountValue(input.target_amount);
  const targetOn = input.target_on || null;
  if (targetOn && (!validDate(targetOn) || targetOn < todayLima())) throw new GoalInputError('La fecha objetivo debe ser hoy o una fecha futura.');
  const [[account]] = await pool.execute('SELECT id FROM accounts WHERE user_id = ? AND id = ?', [userId, input.account_id]);
  if (!account) throw new GoalInputError('La cuenta seleccionada no está disponible.');
  await pool.execute('INSERT INTO goals (id, user_id, account_id, name, target_amount, target_on) VALUES (?, ?, ?, ?, ?, ?)',
    [randomUUID(), userId, input.account_id, input.name.trim(), target, targetOn]);
}

export async function contributeToGoal(pool, userId, input) {
  if (!uuid(input.goal_id) || !uuid(input.account_id) || !uuid(input.request_id)) throw new GoalInputError('Revisa la meta y las cuentas seleccionadas.');
  const amount = amountValue(input.amount);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[goal]] = await connection.execute('SELECT id, account_id, name FROM goals WHERE id = ? AND user_id = ? FOR UPDATE', [input.goal_id, userId]);
    if (!goal) throw new GoalInputError('La meta seleccionada no está disponible.');
    if (goal.account_id === input.account_id) throw new GoalInputError('Elige una cuenta de origen distinta a la cuenta de ahorro.');
    const [accounts] = await connection.execute('SELECT id FROM accounts WHERE user_id = ? AND id IN (?, ?) FOR UPDATE', [userId, input.account_id, goal.account_id]);
    if (accounts.length !== 2) throw new GoalInputError('La cuenta seleccionada no está disponible.');
    const movementId = randomUUID();
    await connection.execute(`INSERT INTO movements (id, user_id, request_id, kind, account_id, destination_id, amount, description, occurred_on)
      VALUES (?, ?, ?, 'transfer', ?, ?, ?, ?, ?)`,
    [movementId, userId, input.request_id, input.account_id, goal.account_id, amount, `Aporte: ${goal.name}`.slice(0, 100), todayLima()]);
    await connection.execute('INSERT INTO goal_contributions (id, user_id, goal_id, movement_id, request_id, amount) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), userId, goal.id, movementId, input.request_id, amount]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new GoalInputError('Este aporte ya se registró. Actualiza la página antes de continuar.');
    throw error;
  } finally { connection.release(); }
}

export async function readGoals(pool, userId) {
  const [goals] = await pool.execute(`SELECT g.id, g.name, g.target_amount, g.target_on, g.account_id, a.name AS account_name,
    COALESCE(SUM(c.amount), 0.00) AS saved FROM goals g
    JOIN accounts a ON a.id = g.account_id AND a.user_id = g.user_id
    LEFT JOIN goal_contributions c ON c.goal_id = g.id AND c.user_id = g.user_id
    WHERE g.user_id = ? GROUP BY g.id, g.name, g.target_amount, g.target_on, g.account_id, a.name ORDER BY g.created_at DESC`, [userId]);
  return goals;
}
