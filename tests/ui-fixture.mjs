// Disposable user for manual browser QA; never run against production.
import nextEnv from '@next/env';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { createDatabasePool } from '../src/lib/database.mjs';
import { hashPassword, tokenHash } from '../src/lib/password.mjs';

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.TEST_DB_NAME || process.env.TEST_DB_NAME !== process.env.DB_NAME) throw new Error('Confirma TEST_DB_NAME para la base de pruebas.');
const path = new URL('../.local-db/ui-fixture.json', import.meta.url);
const pool = createDatabasePool();
const connection = await pool.getConnection();
try {
  if (process.argv[2] === 'create') {
    const id = randomUUID(), email = `ui-${id}@example.invalid`;
    const passwordHash = await hashPassword(process.env.UI_TEST_PASSWORD);
    await mkdir(new URL('../.local-db/', import.meta.url), { recursive: true });
    // Exclusive file creation prevents losing the identity needed for cleanup.
    await writeFile(path, JSON.stringify({ id, email, database: process.env.DB_NAME }), { flag: 'wx' });
    await connection.beginTransaction();
    await connection.execute('INSERT INTO users (id,email,password_hash) VALUES (?,?,?)', [id, email, passwordHash]);
    for (const name of ['Efectivo', 'Ahorros']) await connection.execute('INSERT INTO accounts (id,user_id,name) VALUES (?,?,?)', [randomUUID(), id, name]);
    for (const [name, kind] of [['Ingresos', 'income'], ['Alimentación', 'expense']]) await connection.execute('INSERT INTO categories (id,user_id,name,kind) VALUES (?,?,?,?)', [randomUUID(), id, name, kind]);
    await connection.commit();
    console.log(`Usuario ficticio: ${email}`);
  } else if (process.argv[2] === 'cleanup') {
    const { id, email, database } = JSON.parse(await readFile(path, 'utf8'));
    if (database !== process.env.DB_NAME || email !== `ui-${id}@example.invalid`) throw new Error('La identidad de pruebas no coincide.');
    await connection.beginTransaction();
    const [[user]] = await connection.execute('SELECT email FROM users WHERE id = ? FOR UPDATE', [id]);
    if (user && user.email !== email) throw new Error('Usuario distinto; no se elimina.');
    for (const table of ['movements', 'sessions', 'categories', 'accounts']) await connection.execute(`DELETE FROM ${table} WHERE user_id = ?`, [id]);
    await connection.execute('DELETE FROM users WHERE id = ? AND email = ?', [id, email]);
    await connection.execute('DELETE FROM login_limits WHERE bucket = ?', [tokenHash(`email:${email}`)]);
    await connection.commit();
    await unlink(path);
    console.log('Usuario ficticio y sus datos eliminados.');
  } else throw new Error('Usa create o cleanup.');
} catch (error) { await connection.rollback(); throw error; }
finally { connection.release(); await pool.end(); }
