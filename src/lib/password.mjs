import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';

const derive = (password, salt) => new Promise((resolve, reject) => {
  scrypt(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 },
    (error, key) => error ? reject(error) : resolve(key));
});

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw new Error('La contraseña debe tener entre 12 y 128 caracteres.');
  }
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt);
  return `scrypt-v1$${salt}$${key.toString('hex')}`;
}

export async function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [version, salt, hash] = encoded.split('$');
  if (version !== 'scrypt-v1' || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(hash)) return false;
  const actual = await derive(password, salt);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

export const tokenHash = token => createHash('sha256').update(token).digest('hex');
// An unknown email still runs the same expensive password verification.
export const dummyHash = `scrypt-v1$${'0'.repeat(32)}$${'0'.repeat(128)}`;
