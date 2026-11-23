'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { createPiggybank, releasePiggybank, topUpPiggybank, renamePiggybank } from '@/lib/piggybanks.mjs';
import { PiggybankError } from '@/lib/piggybank-policy.mjs';

export async function addPiggybank(form: FormData) {
  const user = await requireUser();
  try { await createPiggybank(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos crear la alcancía. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Dinero separado en tu alcancía.' };
}

export async function freePiggybank(id: string, amount: string, expectedBalance: string, requestId: string) {
  const user = await requireUser();
  try { await releasePiggybank(db(), user.id, id, amount, expectedBalance, requestId); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos liberar la alcancía. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'El dinero vuelve a estar libre en esta cuenta.' };
}

export async function increasePiggybank(id: string, amount: string, requestId: string) {
  const user = await requireUser();
  try { await topUpPiggybank(db(), user.id, id, amount, requestId); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos agregar el dinero. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Dinero agregado a tu alcancía.' };
}

export async function changePiggybankName(id: string, name: string) {
  const user = await requireUser();
  try { await renamePiggybank(db(), user.id, id, name); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos cambiar el nombre. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Nombre de alcancía actualizado.' };
}
