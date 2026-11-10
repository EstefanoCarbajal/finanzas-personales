'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { InputError, saveMovement } from '@/lib/repository.mjs';

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
