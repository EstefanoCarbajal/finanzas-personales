'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { requireUser, cookieName } from '@/server/auth';
import { db } from '@/server/db';
import { managePrivateUser, createManagedUser, UserManagementError } from '@/lib/user-management.mjs';
export async function addPrivateUser(form: FormData) {
  const user = await requireUser();
  const token = (await cookies()).get(cookieName)?.value;
  try { await createManagedUser(db(), user.id, token, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof UserManagementError ? error.message : 'No pudimos crear el usuario. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Usuario creado. Ya puede iniciar sesión con su correo y contraseña.' };
}

export async function editOrDeleteUser(id: string, mode: 'edit' | 'delete', form: FormData) {
  const user = await requireUser();
  const token = (await cookies()).get(cookieName)?.value;
  try { await managePrivateUser(db(), user.id, token, id, mode, Object.fromEntries(form)); }
  catch (error) { return { success: false, message: error instanceof UserManagementError ? error.message : 'No pudimos completar el cambio. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: mode === 'edit' ? 'Usuario actualizado. Deberá volver a iniciar sesión.' : 'Usuario y datos eliminados.' };
}
