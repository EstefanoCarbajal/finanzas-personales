import mysql from 'mysql2/promise';

export function databaseOptions() {
  for (const name of ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!process.env[name]) throw new Error(`Falta configurar ${name}.`);
  }
  return {
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    charset: 'utf8mb4', timezone: 'Z', dateStrings: true,
    decimalNumbers: false, supportBigNumbers: true, bigNumberStrings: true,
    multipleStatements: false, connectionLimit: 5,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
  };
}

export const createDatabasePool = () => mysql.createPool(databaseOptions());
