'use server';
import { CreditError } from '@/lib/credit.mjs';
import { PiggybankError } from '@/lib/piggybank-policy.mjs';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { deleteMovement, InputError, saveMovement, updateMovement } from '@/lib/repository.mjs';
import { randomUUID } from 'node:crypto';
import { manageFuturePayment, deleteBudget, updateBudget, cancelPayment, PlanningInputError, saveBudget, schedulePayment, settlePayment } from '@/lib/planning.mjs';
import { manageGoal, contributeToGoal, createGoal, GoalInputError } from '@/lib/goals.mjs';
import { createHabit, createPersonalReward, HabitInputError, markHabitComplete, redeemPersonalReward } from '@/lib/habits.mjs';
import { saveAccountOrder } from '@/lib/account-order.mjs';
import { createCategory, saveCategoryIcon, updateCategory, deleteCategory, CategoryInputError } from '@/lib/categories.mjs';
import { renameAccount, deleteAccount, AccountInputError } from '@/lib/accounts.mjs';
import { BANK_CODES } from '@/lib/banks.mjs';
import { decimal, toCents } from '@/lib/money.mjs';
import type { ResultSetHeader } from 'mysql2';

export async function editAccount(accountId: string, name: string, bankCode: string) {
  const user = await requireUser();
  try { await renameAccount(db(), user.id, accountId, name, bankCode); }
  catch (error) { return { success: false, message: error instanceof AccountInputError ? error.message : 'No pudimos editar la cuenta.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Nombre de cuenta actualizado.' };
}

export async function toggleAccountSummary(accountId: string, selected: boolean) {
  const user = await requireUser();
  if (typeof accountId !== 'string' || accountId.length !== 36 || typeof selected !== 'boolean') return { success: false, message: 'La selección de cuenta no es válida.' };
  const [result] = await db().execute<ResultSetHeader>("UPDATE accounts SET summary_selected = ? WHERE user_id = ? AND id = ? AND account_type = 'asset'", [selected, user.id, accountId]);
  if (!result.affectedRows) return { success: false, message: 'La cuenta ya no está disponible.' };
  revalidatePath('/privado');
  return { success: true, message: selected ? 'Cuenta añadida al resumen.' : 'Cuenta quitada del resumen.' };
}

export async function removeAccount(accountId: string) {
  const user = await requireUser();
  try { await deleteAccount(db(), user.id, accountId); }
  catch (error) { return { success: false, message: error instanceof AccountInputError ? error.message : 'No pudimos eliminar la cuenta.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Cuenta eliminada.' };
}

export async function updateAccountOrder(ids: string[]) {
  const user = await requireUser();
  try { await saveAccountOrder(db(), user.id, ids); }
  catch { return { success: false, message: 'No pudimos guardar el orden. Actualiza la página e inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Orden guardado.' };
}

export async function addMovement(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try {
    await saveMovement(db(), user.id, Object.fromEntries(form));
  } catch (error) {
    return { message: error instanceof InputError || error instanceof CreditError || error instanceof PiggybankError ? error.message : 'No pudimos guardar el movimiento. Inténtalo de nuevo.', success: false };
  }
  revalidatePath('/privado');
  return { message: 'Movimiento guardado.', success: true };
}

export async function editMovement(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try {
    await updateMovement(db(), user.id, form.get('movement_id'), Object.fromEntries(form));
  } catch (error) {
    return { message: error instanceof InputError || error instanceof CreditError || error instanceof PiggybankError ? error.message : 'No pudimos actualizar el movimiento. Inténtalo de nuevo.', success: false };
  }
  revalidatePath('/privado');
  return { message: 'Movimiento actualizado.', success: true };
}

export async function removeMovement(form: FormData) {
  const user = await requireUser();
  try {
    await deleteMovement(db(), user.id, form.get('movement_id'));
  } catch (error) {
    return { message: error instanceof InputError || error instanceof CreditError || error instanceof PiggybankError ? error.message : 'No pudimos eliminar el movimiento. Inténtalo de nuevo.', success: false };
  }
  revalidatePath('/privado');
  return { message: 'Movimiento eliminado.', success: true };
}

async function createOwnedAccount(userId: string, name: unknown, currency: unknown, bank: unknown, openingBalance: unknown) {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) throw new InputError('Escribe un nombre de hasta 80 caracteres.');
  if (currency !== 'PEN' && currency !== 'USD') throw new InputError('Selecciona una moneda válida.');
  if (typeof bank !== 'string' || !BANK_CODES.has(bank)) throw new InputError('Selecciona un banco.');
  let opening = '0.00';
  try { opening = decimal(toCents(typeof openingBalance === 'string' && openingBalance ? openingBalance : '0')); }
  catch { throw new InputError('Escribe un saldo inicial válido con hasta dos decimales.'); }
  try {
    await db().execute('INSERT INTO accounts (id, user_id, name, currency, bank_code, opening_balance) VALUES (?, ?, ?, ?, ?, ?)', [randomUUID(), userId, name.trim(), currency, bank, opening]);
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'ER_DUP_ENTRY') throw new InputError('Ya existe un elemento con ese nombre.');
    throw error;
  }
}

export async function addAccount(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createOwnedAccount(user.id, form.get('name'), form.get('currency') || 'PEN', form.get('bank_code'), form.get('opening_balance')); }
  catch (error) { return { message: error instanceof InputError || error instanceof CreditError ? error.message : 'No pudimos guardar la cuenta.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Cuenta añadida.', success: true };
}

export async function addCategory(_previous: { message: string; success: boolean }, form: FormData) {
  const user = await requireUser();
  try { await createCategory(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { message: error instanceof CategoryInputError ? error.message : 'No pudimos guardar la categoría.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Categoría añadida.', success: true };
}

export async function updateCategoryIcon(categoryId: string, icon: string) {
  const user = await requireUser();
  try { await saveCategoryIcon(db(), user.id, categoryId, icon); }
  catch (error) { return { message: error instanceof CategoryInputError ? error.message : 'No pudimos guardar el icono.', success: false }; }
  revalidatePath('/privado');
  return { message: 'Icono actualizado.', success: true };
}

export async function editCategory(categoryId: string, input: { name: string; kind: string; icon: string; color?: string }) {
  const user = await requireUser();
  try { await updateCategory(db(), user.id, categoryId, input); }
  catch (error) { return { success: false, message: error instanceof CategoryInputError ? error.message : 'No pudimos editar la categoría.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Categoría actualizada.' };
}

export async function removeCategory(categoryId: string) {
  const user = await requireUser();
  try { await deleteCategory(db(), user.id, categoryId); }
  catch (error) { return { success: false, message: error instanceof CategoryInputError ? error.message : 'No pudimos eliminar la categoría.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Categoría eliminada.' };
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
  try { await settlePayment(db(), user.id, form.get('id')); }
  catch (error) { return { success: false, message: error instanceof PlanningInputError || error instanceof PiggybankError || error instanceof CreditError ? error.message : 'No pudimos confirmar el pago. Revisa su estado antes de reintentar.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Pago confirmado. El gasto ya está registrado.' };
}

export async function cancelScheduledPayment(form: FormData) {
  const user = await requireUser();
  try { await cancelPayment(db(), user.id, form.get('id')); }
  catch (error) { return { success: false, message: error instanceof PlanningInputError ? error.message : 'No pudimos cancelar el pago. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Pago cancelado. No se creó ningún gasto.' };
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
  catch (error) { return { message: error instanceof GoalInputError || error instanceof PiggybankError ? error.message : 'No pudimos guardar el aporte.', success: false }; }
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

export async function manageBudget(id: string, mode: 'edit' | 'delete', amount?: string) {
  const user = await requireUser();
  try {
    if (mode === 'edit') await updateBudget(db(), user.id, id, amount);
    else if (mode === 'delete') await deleteBudget(db(), user.id, id);
    else return { success: false, message: 'Elige una acción válida.' };
  } catch (error) { return { success: false, message: error instanceof PlanningInputError ? error.message : 'No pudimos actualizar el presupuesto. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: mode === 'edit' ? 'Presupuesto actualizado.' : 'Presupuesto eliminado. Tus gastos se conservan.' };
}

export async function changeGoal(id: string, mode: 'edit' | 'delete', input?: { name: string; target_amount: string; target_on: string | null }) {
  const user = await requireUser();
  try { await manageGoal(db(), user.id, id, mode, input); }
  catch (error) { return { success: false, message: error instanceof GoalInputError ? error.message : 'No pudimos actualizar la meta. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: mode === 'edit' ? 'Meta actualizada.' : 'Meta eliminada. Los aportes y movimientos se conservan.' };
}

export async function changeFuturePayment(id: string, mode: 'edit' | 'delete', input?: { description: string; amount: string; due_on: string; account_id: string; category_id: string; payment_mode: string; automatic_time: string }) {
  const user = await requireUser();
  try { await manageFuturePayment(db(), user.id, id, mode, input); }
  catch (error) { return { success: false, message: error instanceof PlanningInputError ? error.message : 'No pudimos actualizar el pago. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: mode === 'edit' ? 'Pago actualizado.' : 'Pago eliminado sin registrar un gasto.' };
}
