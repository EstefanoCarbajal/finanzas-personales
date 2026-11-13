'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { validAvatar } from '@/lib/avatars.mjs';
import { saveAvatar } from '@/lib/profile.mjs';

export async function updateAvatar(avatarId: string) {
  const user = await requireUser();
  if (!validAvatar(avatarId)) return { success: false, message: 'Elige uno de los avatares disponibles.' };
  try { await saveAvatar(db(), user.id, avatarId); }
  catch { return { success: false, message: 'No pudimos guardar tu avatar. Inténtalo de nuevo.' }; }
  revalidatePath('/privado');
  return { success: true, message: 'Avatar actualizado' };
}
