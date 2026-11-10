import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionUser } from '@/lib/repository.mjs';
import { db, databaseConfigured } from './db';

export const cookieName = process.env.NODE_ENV === 'production' ? '__Host-finanzas_session' : 'finanzas_session';
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 7 * 24 * 60 * 60 };

export async function requireUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!databaseConfigured() || !token) redirect('/login');
  const user = await sessionUser(db(), token);
  if (!user) redirect('/login');
  return user;
}
