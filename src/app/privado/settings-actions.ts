'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { requireUser, cookieName } from '@/server/auth';
import { db } from '@/server/db';
import { updateCredentials, SettingsError } from '@/lib/settings.mjs';

export async function saveCredentials(form: FormData) {
  const user = await requireUser();
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (!token) return { success: false, message: 'Vuelve a iniciar sesión.' };
  try {
    await updateCredentials(db(), user.id, token, Object.fromEntries(form));
  } catch (error) {
    return { success: false, message: error instanceof SettingsError ? error.message : 'No pudimos guardar el cambio. Inténtalo de nuevo.' };
  }
  jar.delete(cookieName);
  revalidatePath('/privado');
  return { success: true, message: 'Cambio guardado. Inicia sesión con tus nuevos datos.' };
}
