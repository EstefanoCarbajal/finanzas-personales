import nextEnv from '@next/env';
import { randomUUID } from 'node:crypto';
import { createDatabasePool } from '../src/lib/database.mjs';
import { hashPassword } from '../src/lib/password.mjs';

nextEnv.loadEnvConfig(process.cwd());
const email = (process.env.INITIAL_USER_EMAIL || '').trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Configura INITIAL_USER_EMAIL.');
const hash = await hashPassword(process.env.INITIAL_USER_PASSWORD);
const pool = createDatabasePool();
const connection = await pool.getConnection();
try {
  const [[lock]] = await connection.query("SELECT GET_LOCK('finanzas_initial_user', 10) AS acquired");
  if (lock.acquired !== 1) throw new Error('La creación de usuario está en curso.');
  await connection.beginTransaction();
  const [[count]] = await connection.query('SELECT COUNT(*) AS total FROM users');
  if (Number(count.total) !== 0) throw new Error('Ya existe un usuario. Este comando solo crea la cuenta inicial.');
  const id = randomUUID();
  await connection.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, hash]);
  for (const name of ['Efectivo', 'Cuenta principal', 'Ahorros']) {
    await connection.execute('INSERT INTO accounts (id, user_id, name) VALUES (?, ?, ?)', [randomUUID(), id, name]);
  }
  for (const [name, kind] of [['Ingresos', 'income'], ['Alimentación', 'expense'], ['Transporte', 'expense'], ['Vivienda', 'expense'], ['Ocio', 'expense'], ['Salud', 'expense'], ['Otros', 'expense']]) {
    await connection.execute('INSERT INTO categories (id, user_id, name, kind) VALUES (?, ?, ?, ?)', [randomUUID(), id, name, kind]);
  }
  await connection.commit(); console.log('Cuenta inicial creada. Retira INITIAL_USER_PASSWORD de la configuración.');
} catch (error) {
  await connection.rollback(); throw error;
} finally {
  await connection.query("SELECT RELEASE_LOCK('finanzas_initial_user')");
  connection.release(); await pool.end();
}
