'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { InputError, saveMovement } from '@/lib/repository.mjs';
import { randomUUID } from 'node:crypto';
import { cancelPayment, PlanningInputError, saveBudget, schedulePayment, settlePayment } from '@/lib/planning.mjs';
import { contributeToGoal, createGoal, GoalInputError } from '@/lib/goals.mjs';
import { createHabit, createPersonalReward, HabitInputError, markHabitComplete, redeemPersonalReward } from '@/lib/habits.mjs';

export async function addMovement(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try {
    await saveMovement(db(), user.id, Object.fromEntries(form));
  } catch (error) {
    return { message: error instanceof InputError ? error.message : 'No pudimos guardar el movimiento. Inténtalo de nuevo.', success: false };
  }
  revalidatePath('/privado');
  return { message: 'Movimiento guardado.', success: true };
}

async function createOwnedName(table: 'accounts' | 'categories', userId: string, name: unknown, kind?: unknown) {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) throw new InputError('Escribe un nombre de hasta 80 caracteres.');
  if (table === 'categories' && kind !== 'income' && kind !== 'expense') throw new InputError('Elige si la categoría es de ingreso o gasto.');
  try {
    if (table === 'accounts') await db().execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [randomUUID(), userId, name.trim()]);
    else await db().execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [randomUUID(), userId, name.trim(), kind as string]);
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'ER_DUP_ENTRY') throw new InputError('Ya existe un elemento con ese nombre.');
    throw error;
  }
}

export async function addAccount(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createOwnedName('accounts', user.id, form.get('name')); }
  catch (error) { return { message: error instanceof InputError ? error.message : 'No pudimos guardar la cuenta.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Cuenta añadida.', success: true };
}

export async function addCategory(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createOwnedName('categories', user.id, form.get('name'), form.get('kind')); }
  catch (error) { return { message: error instanceof InputError ? error.message : 'No pudimos guardar la categoría.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Categoría añadida.', success: true };
}

export async function addBudget(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await saveBudget(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof PlanningInputError ? error.message : 'No pudimos guardar el presupuesto.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Presupuesto guardado para este mes.', success: true };
}

export async function addScheduledPayment(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await schedulePayment(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof PlanningInputError ? error.message : 'No pudimos guardar el pago.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Pago futuro guardado. No se descontó del saldo.', success: true };
}

export async function markPaymentPaid(form: FormData) {
  const user = await requireUser();
  await settlePayment(db(), user.id, form.get('id'));
  revalidatePath('/privado');
}

export async function cancelScheduledPayment(form: FormData) {
  const user = await requireUser();
  await cancelPayment(db(), user.id, form.get('id'));
  revalidatePath('/privado');
}

export async function addGoal(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createGoal(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof GoalInputError ? error.message : 'No pudimos guardar la meta.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Meta creada. Ya puedes registrar tus aportes.', success: true };
}

export async function addGoalContribution(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await contributeToGoal(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof GoalInputError ? error.message : 'No pudimos guardar el aporte.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Aporte guardado como transferencia entre tus cuentas.', success: true };
}

export async function addHabit(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createHabit(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof HabitInputError ? error.message : 'No pudimos guardar el hábito.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Hábito añadido. Cada día completado suma 10 puntos.', success: true };
}

export async function completeHabit(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await markHabitComplete(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof HabitInputError ? error.message : 'No pudimos marcar este hábito.', success: false }; }
  revalidatePath('/privado');
  return { message: '¡Hábito cumplido! Sumaste 10 puntos.', success: true };
}

export async function addPersonalReward(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createPersonalReward(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof HabitInputError ? error.message : 'No pudimos guardar la recompensa.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Recompensa añadida a tu lista personal.', success: true };
}

export async function redeemReward(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await redeemPersonalReward(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof HabitInputError ? error.message : 'No pudimos procesar el canje.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Recompensa canjeada. ¡Disfrútala!', success: true };
}
