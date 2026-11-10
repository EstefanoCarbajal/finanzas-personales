'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { login, revokeSession } from '@/lib/repository.mjs';
import { db, databaseConfigured } from '@/server/db';
import { cookieName, cookieOptions } from '@/server/auth';

export async function signIn(_previous: { message: string }, form: FormData) {
  if (!databaseConfigured()) return { message: 'El acceso privado todavía no está configurado.' };
  let token: string | null;
  try {
    token = await login(db(), form.get('email'), form.get('password'));
  } catch {
    return { message: 'No pudimos conectar. Inténtalo más tarde.' };
  }
  if (!token) return { message: 'No se pudo iniciar sesión. Revisa tus datos o espera 15 minutos antes de reintentar.' };
  const jar = await cookies();
  const oldToken = jar.get(cookieName)?.value;
  if (oldToken) await revokeSession(db(), oldToken);
  jar.set(cookieName, token, cookieOptions);
  redirect('/privado');
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token && databaseConfigured()) await revokeSession(db(), token);
  jar.set(cookieName, '', { ...cookieOptions, maxAge: 0 });
  redirect('/login');
}
