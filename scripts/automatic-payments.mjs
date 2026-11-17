import nextEnv from '@next/env';
import { createDatabasePool } from '../src/lib/database.mjs';
import { processAutomaticPayments } from '../src/lib/planning.mjs';
nextEnv.loadEnvConfig(process.cwd());
const pool = createDatabasePool();
let stopped = false;
process.on('SIGINT', () => { stopped = true; });
process.on('SIGTERM', () => { stopped = true; });
try {
  do {
    try { const result = await processAutomaticPayments(pool); if (result.failed) console.error('Hay registros automáticos pendientes de reintento:', result.failed); }
    catch { console.error('No se pudo procesar la programación. Revisa conexión y migraciones.'); if (process.argv.includes('--once')) process.exitCode = 1; }
    if (process.argv.includes('--once') || stopped) break;
    await new Promise(resolve => setTimeout(resolve, 15000));
  } while (!stopped);
} finally { await pool.end(); }
