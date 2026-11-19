'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { createPiggybank, releasePiggybank } from '@/lib/piggybanks.mjs';
import { PiggybankError } from '@/lib/piggybank-policy.mjs';

export async function addPiggybank(form: FormData) {
  const user = await requireUser();
  try { await createPiggybank(db(), user.id, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos crear la alcancía. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Dinero separado en tu alcancía.' };
}

export async function freePiggybank(id: string) {
  const user = await requireUser();
  try { await releasePiggybank(db(), user.id, id); }
  catch (error) { return { success: false, message: error instanceof PiggybankError ? error.message : 'No pudimos liberar la alcancía. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'El dinero vuelve a estar libre en esta cuenta.' };
}
