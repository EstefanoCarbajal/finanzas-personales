import 'server-only';
import { createDatabasePool } from '@/lib/database.mjs';

const globalDb = globalThis as typeof globalThis & { financePool?: ReturnType<typeof createDatabasePool> };
export const databaseConfigured = () => ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'].every(key => Boolean(process.env[key]));
export function db() {
  globalDb.financePool ??= createDatabasePool();
  return globalDb.financePool;
}
