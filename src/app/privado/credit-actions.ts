'use server';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { createCreditCard, editCreditCard, deleteCreditCard, CreditError } from '@/lib/credit.mjs';

export async function addCreditCard(form: FormData) {
  const user = await requireUser();
  try { await createCreditCard(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof CreditError ? error.message : 'No pudimos guardar la tarjeta. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Tarjeta añadida.' };
}

export async function updateCreditCard(cardId: string, form: FormData) {
  const user = await requireUser();
  try { await editCreditCard(db(), user.id, cardId, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof CreditError ? error.message : 'No pudimos editar la tarjeta. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Tarjeta actualizada.' };
}

export async function removeCreditCard(cardId: string) {
  const user = await requireUser();
  try { await deleteCreditCard(db(), user.id, cardId); }
  catch (error) { return { success: false, message: error instanceof CreditError ? error.message : 'No pudimos eliminar la tarjeta. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Tarjeta eliminada.' };
}
