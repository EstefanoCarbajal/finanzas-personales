import nextEnv from '@next/env';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createDatabasePool } from '../src/lib/database.mjs';

nextEnv.loadEnvConfig(process.cwd());
const pool = createDatabasePool();
const connection = await pool.getConnection();
try {
  const [[lock]] = await connection.query("SELECT GET_LOCK('finanzas_migrations', 10) AS acquired");
  if (lock.acquired !== 1) throw new Error('Otra migración está en curso.');
  await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(160) PRIMARY KEY, checksum CHAR(64) NOT NULL,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB`);
  const directory = new URL('../migrations/', import.meta.url);
  for (const name of (await readdir(directory)).filter(n => n.endsWith('.sql')).sort()) {
    const sql = await readFile(new URL(name, directory), 'utf8');
    const checksum = createHash('sha256').update(sql).digest('hex');
    const [[existing]] = await connection.execute('SELECT checksum FROM schema_migrations WHERE name = ?', [name]);
    if (existing) {
      if (existing.checksum !== checksum) throw new Error(`La migración aplicada ${name} cambió. No continuar.`);
      continue;
    }
    // These versioned migrations contain plain DDL only, no procedures or semicolons in literals.
    // MySQL DDL auto-commits: a partial failure requires manual repair, never silent marking as applied.
    for (const statement of sql.split(';').map(s => s.trim()).filter(Boolean)) await connection.query(statement);
    await connection.execute('INSERT INTO schema_migrations (name, checksum) VALUES (?, ?)', [name, checksum]);
    console.log(`Aplicada: ${name}`);
  }
} finally {
  await connection.query("SELECT RELEASE_LOCK('finanzas_migrations')");
  connection.release(); await pool.end();
}
