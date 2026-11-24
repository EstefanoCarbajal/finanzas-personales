import { validatePaymentEdit } from './payment-edit-policy.mjs';
import { randomUUID } from 'node:crypto';
import { checkAccountReservations } from './piggybanks.mjs';
import { checkCreditLedger } from './credit.mjs';
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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Serialize category validation with type edits, avoiding a stale expense check.
    const [[category]] = await connection.execute("SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = 'expense' FOR UPDATE", [userId, input.category_id]);
    if (!category) throw new PlanningInputError('La categoría de gasto no está disponible.');
    await connection.execute(`INSERT INTO budgets (id, user_id, category_id, month_start, amount) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE amount = VALUES(amount)`, [randomUUID(), userId, input.category_id, monthStart, amount]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function schedulePayment(pool, userId, input) {
  if (!uuid(input.account_id) || !uuid(input.category_id)) throw new PlanningInputError('Elige una cuenta y categoría válidas.');
  if (typeof input.description !== 'string' || !input.description.trim() || input.description.trim().length > 100) throw new PlanningInputError('Escribe una descripción de hasta 100 caracteres.');
  if (!validDate(input.due_on) || input.due_on < todayLima()) throw new PlanningInputError('El vencimiento debe ser hoy o una fecha futura.');
  const amount = parseAmount(input.amount);
  const automaticAt = automaticPaymentTime(input);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[account]] = await connection.execute(`SELECT id FROM accounts WHERE user_id = ? AND account_type IN ('asset', 'credit') AND id = ? FOR UPDATE`, [userId, input.account_id]);
    const [[category]] = await connection.execute('SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = \'expense\' FOR UPDATE', [userId, input.category_id]);
    if (!account || !category) throw new PlanningInputError('La cuenta o categoría no está disponible.');
    await connection.execute('INSERT INTO scheduled_payments (id, user_id, account_id, category_id, description, amount, due_on, automatic_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [randomUUID(), userId, input.account_id, input.category_id, input.description.trim(), amount, input.due_on, automaticAt]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function settlePayment(pool, userId, paymentId, automatic = false) {
  if (!uuid(paymentId)) throw new PlanningInputError('El pago seleccionado no es válido.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[payment]] = await connection.execute(`SELECT id, account_id, category_id, description, amount, due_on, automatic_at, (automatic_at <= UTC_TIMESTAMP()) AS due
      FROM scheduled_payments WHERE id = ? AND user_id = ? AND status = 'scheduled' FOR UPDATE`, [paymentId, userId]);
    if (automatic && (!payment || !payment.automatic_at || !payment.due)) { await connection.rollback(); return false; }
    if (!payment) throw new PlanningInputError('Este pago ya se confirmó o no está disponible.');
    const [[refs]] = await connection.execute(`SELECT a.id AS account_id, a.currency, c.id AS category_id FROM accounts a
      JOIN categories c ON c.user_id = a.user_id WHERE a.user_id = ? AND a.account_type IN ('asset', 'credit') AND a.id = ? AND c.id = ? AND c.kind = 'expense' FOR UPDATE`,
    [userId, payment.account_id, payment.category_id]);
    if (!refs) throw new PlanningInputError('La cuenta o categoría ya no está disponible.');
    const paidOn = automatic ? payment.due_on : todayLima();
    await connection.execute(`INSERT INTO movements (id, user_id, request_id, kind, account_id, category_id, amount, description, occurred_on, currency)
      VALUES (?, ?, ?, 'expense', ?, ?, ?, ?, ?, ?)`, [randomUUID(), userId, payment.id, payment.account_id, payment.category_id, payment.amount, payment.description, paidOn, refs.currency]);
    await connection.execute("UPDATE scheduled_payments SET status = 'paid', paid_on = ? WHERE id = ? AND user_id = ?", [paidOn, paymentId, userId]);
    await checkCreditLedger(connection, userId);
    await checkAccountReservations(connection, userId);
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
  const [payments] = await pool.execute(`SELECT p.id, p.account_id, p.category_id, p.description, p.amount, p.due_on, p.status, p.paid_on, p.automatic_at,
    DATE_FORMAT(DATE_SUB(p.automatic_at, INTERVAL 5 HOUR), '%H:%i') AS automatic_time,
    a.name AS account_name, a.currency, c.name AS category_name FROM scheduled_payments p
    JOIN accounts a ON a.id = p.account_id AND a.user_id = p.user_id
    JOIN categories c ON c.id = p.category_id AND c.user_id = p.user_id
    WHERE p.user_id = ? AND p.status = 'scheduled' ORDER BY p.due_on, p.created_at`, [userId]);
  return { budgets, payments };
}

// Lima has a fixed UTC-05:00 offset; stored execution timestamps are UTC.
export function automaticPaymentTime(input, now = new Date()) {
  if (!input.payment_mode || input.payment_mode === 'manual') return null;
  if (input.payment_mode !== 'automatic' || !validDate(input.due_on) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.automatic_time || '')) throw new PlanningInputError('Elige una fecha y hora válidas.');
  const date = new Date(input.due_on + 'T' + input.automatic_time + ':00-05:00');
  if (date <= now) throw new PlanningInputError('El registro automático debe programarse para una hora futura de Lima.');
  return date.toISOString().slice(0,19).replace('T',' ');
}

export async function processAutomaticPayments(pool, userId = null) {
  const [payments] = await pool.execute(`SELECT id, user_id FROM scheduled_payments WHERE status = 'scheduled' AND automatic_at <= UTC_TIMESTAMP() ${userId ? 'AND user_id = ?' : ''} ORDER BY automatic_at LIMIT 100`, userId ? [userId] : []);
  let failed = 0;
  for (const payment of payments) {
    try { await settlePayment(pool, payment.user_id, payment.id, true); }
    catch { failed++; }
  }
  return { checked: payments.length, failed };
}

export async function updateBudget(pool, userId, id, inputAmount) {
  if (!uuid(id)) throw new PlanningInputError('Selecciona un presupuesto válido.');
  const amount = parseAmount(inputAmount);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[budget]] = await connection.execute('SELECT id FROM budgets WHERE user_id = ? AND id = ? FOR UPDATE', [userId, id]);
    if (!budget) throw new PlanningInputError('El presupuesto ya no está disponible.');
    await connection.execute('UPDATE budgets SET amount = ? WHERE user_id = ? AND id = ?', [amount, userId, id]);
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

export async function deleteBudget(pool, userId, id) {
  if (!uuid(id)) throw new PlanningInputError('Selecciona un presupuesto válido.');
  const [result] = await pool.execute('DELETE FROM budgets WHERE user_id = ? AND id = ?', [userId, id]);
  if (!result.affectedRows) throw new PlanningInputError('El presupuesto ya no está disponible.');
}

export async function manageFuturePayment(pool, userId, id, mode, input) {
  if (!uuid(id) || !['edit', 'delete'].includes(mode)) throw new PlanningInputError('Elige un pago y acción válidos.');
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [userId]);
    const [[payment]] = await connection.execute("SELECT due_on FROM scheduled_payments WHERE user_id = ? AND id = ? AND status = 'scheduled' FOR UPDATE", [userId, id]);
    if (!payment) throw new PlanningInputError('El pago ya fue procesado o no está disponible.');
    if (mode === 'delete') await connection.execute("UPDATE scheduled_payments SET status = 'cancelled' WHERE user_id = ? AND id = ?", [userId, id]);
    else {
      let value;
      try { value = validatePaymentEdit(input, todayLima(), payment.due_on); } catch (error) { throw new PlanningInputError(error.message); }
      if (!uuid(input.account_id) || !uuid(input.category_id)) throw new PlanningInputError('Elige una cuenta y categoría válidas.');
      const [[account]] = await connection.execute("SELECT id FROM accounts WHERE user_id = ? AND id = ? AND account_type IN ('asset', 'credit') FOR UPDATE", [userId, input.account_id]);
      const [[category]] = await connection.execute("SELECT id FROM categories WHERE user_id = ? AND id = ? AND kind = 'expense' FOR UPDATE", [userId, input.category_id]);
      if (!account || !category) throw new PlanningInputError('La cuenta o categoría ya no está disponible.');
      await connection.execute('UPDATE scheduled_payments SET description = ?, amount = ?, due_on = ?, automatic_at = ?, account_id = ?, category_id = ? WHERE user_id = ? AND id = ?', [value.description, value.amount, value.due_on, value.automatic_at, input.account_id, input.category_id, userId, id]);
    }
    await connection.commit();
  } catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}
