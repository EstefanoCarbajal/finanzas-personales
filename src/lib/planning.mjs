import { randomUUID } from 'node:crypto';
import { decimal, toCents } from './money.mjs';
import { todayLima } from './repository.mjs';

export class PlanningInputError extends Error {}
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
const parseAmount = value => {
  try { const cents = toCents(value); if (cents <= 0n) throw new Error(); return decimal(cents); }
  catch { throw new PlanningInputError('Introduce un importe mayor que cero, con hasta dos decimales.'); }
};

export async function saveBudget(pool, userId, input) {
  if (!uuid(input.category_id) || !/^\d{4}-\d{2}$/.test(input.month)) throw new PlanningInputError('Elige una categoría y un mes válidos.');
  const monthStart = `${input.month}-01`;
  if (!validDate(monthStart)) throw new PlanningInputError('El mes elegido no es válido.');
  const amount = parseAmount(input.amount);
  const [[category]] = await pool.execute('SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = \'expense\'', [userId, input.category_id]);
  if (!category) throw new PlanningInputError('La categoría de gasto no está disponible.');
  await pool.execute(`INSERT INTO budgets (id, user_id, category_id, month_start, amount) VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE amount = VALUES(amount)`, [randomUUID(), userId, input.category_id, monthStart, amount]);
}

export async function schedulePayment(pool, userId, input) {
  if (!uuid(input.account_id) || !uuid(input.category_id)) throw new PlanningInputError('Elige una cuenta y categoría válidas.');
  if (typeof input.description !== 'string' || !input.description.trim() || input.description.trim().length > 100) throw new PlanningInputError('Escribe una descripción de hasta 100 caracteres.');
  if (!validDate(input.due_on) || input.due_on < todayLima()) throw new PlanningInputError('El vencimiento debe ser hoy o una fecha futura.');
  const amount = parseAmount(input.amount);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[account]] = await connection.execute('SELECT id FROM accounts WHERE user_id = ? AND id = ? FOR UPDATE', [userId, input.account_id]);
    const [[category]] = await connection.execute('SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = \'expense\' FOR UPDATE', [userId, input.category_id]);
    if (!account || !category) throw new PlanningInputError('La cuenta o categoría no está disponible.');
    await connection.execute('INSERT INTO scheduled_payments (id, user_id, account_id, category_id, description, amount, due_on) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), userId, input.account_id, input.category_id, input.description.trim(), amount, input.due_on]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function settlePayment(pool, userId, paymentId) {
  if (!uuid(paymentId)) throw new PlanningInputError('El pago seleccionado no es válido.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[payment]] = await connection.execute(`SELECT id, account_id, category_id, description, amount
      FROM scheduled_payments WHERE id = ? AND user_id = ? AND status = 'scheduled' FOR UPDATE`, [paymentId, userId]);
    if (!payment) throw new PlanningInputError('Este pago ya se confirmó o no está disponible.');
    const [[refs]] = await connection.execute(`SELECT a.id AS account_id, c.id AS category_id FROM accounts a
      JOIN categories c ON c.user_id = a.user_id WHERE a.user_id = ? AND a.id = ? AND c.id = ? AND c.kind = 'expense' FOR UPDATE`,
    [userId, payment.account_id, payment.category_id]);
    if (!refs) throw new PlanningInputError('La cuenta o categoría ya no está disponible.');
    const paidOn = todayLima();
    await connection.execute(`INSERT INTO movements (id, user_id, request_id, kind, account_id, category_id, amount, description, occurred_on)
      VALUES (?, ?, ?, 'expense', ?, ?, ?, ?, ?)`, [randomUUID(), userId, payment.id, payment.account_id, payment.category_id, payment.amount, payment.description, paidOn]);
    await connection.execute("UPDATE scheduled_payments SET status = 'paid', paid_on = ? WHERE id = ? AND user_id = ?", [paidOn, paymentId, userId]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function cancelPayment(pool, userId, paymentId) {
  if (!uuid(paymentId)) throw new PlanningInputError('El pago seleccionado no es válido.');
  const [result] = await pool.execute("UPDATE scheduled_payments SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'scheduled'", [paymentId, userId]);
  if (!result.affectedRows) throw new PlanningInputError('Este pago ya fue procesado o no está disponible.');
}

export async function readPlanning(pool, userId, month) {
  const monthStart = `${month}-01`;
  const [budgets] = await pool.execute(`SELECT b.id, b.category_id, c.name AS category_name, b.month_start, b.amount,
    COALESCE(SUM(CASE WHEN m.kind = 'expense' THEN m.amount ELSE 0 END), 0.00) AS spent
    FROM budgets b JOIN categories c ON c.id = b.category_id AND c.user_id = b.user_id
    LEFT JOIN movements m ON m.user_id = b.user_id AND m.category_id = b.category_id AND m.kind = 'expense'
      AND m.occurred_on >= b.month_start AND m.occurred_on < DATE_ADD(b.month_start, INTERVAL 1 MONTH)
    WHERE b.user_id = ? AND b.month_start = ? GROUP BY b.id, b.category_id, c.name, b.month_start, b.amount ORDER BY c.name`, [userId, monthStart]);
  const [payments] = await pool.execute(`SELECT p.id, p.description, p.amount, p.due_on, p.status, p.paid_on,
    a.name AS account_name, c.name AS category_name FROM scheduled_payments p
    JOIN accounts a ON a.id = p.account_id AND a.user_id = p.user_id
    JOIN categories c ON c.id = p.category_id AND c.user_id = p.user_id
    WHERE p.user_id = ? AND p.status = 'scheduled' ORDER BY p.due_on, p.created_at`, [userId]);
  return { budgets, payments };
}
