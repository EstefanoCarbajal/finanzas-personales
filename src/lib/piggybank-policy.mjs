import { decimal, toCents } from './money.mjs';

export class PiggybankError extends Error {}

export function validatePiggybankName(name) {
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 60) throw new PiggybankError('Escribe un nombre de hasta 60 caracteres.');
  return name.trim();
}

export function validatePiggybank(input, today) {
  const name = validatePiggybankName(input?.name);
  let amount;
  try { amount = toCents(input.amount); } catch { throw new PiggybankError('Revisa el importe, con hasta dos decimales.'); }
  if (amount <= 0n) throw new PiggybankError('Separa un importe mayor que cero.');
  const target = input.target_on || null;
  if (target) {
    if (typeof target !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(target) || target < today || target > '9999-12-31') throw new PiggybankError('Elige hoy o una fecha futura.');
    const date = new Date(`${target}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== target) throw new PiggybankError('La fecha no existe.');
  }
  return { name, amount: decimal(amount), target_on: target };
}

export const accountMovements = (movements, accountId) => movements.filter(m => m.account_id === accountId || m.destination_id === accountId);

export function accountAllocation(balance, banks) {
  const reserved = banks.reduce((sum, bank) => sum + toCents(bank.amount), 0n);
  return { reserved: decimal(reserved), free: decimal(BigInt(balance.replace('.', '')) - reserved) };
}

// Accounts without reservations keep their existing overdraft behavior.
export function assertReservations(balances, banks) {
  for (const accountId of new Set(banks.map(bank => bank.account_id))) {
    if (BigInt(accountAllocation(balances[accountId] || '0.00', banks.filter(bank => bank.account_id === accountId)).free.replace('.', '')) < 0n) {
      throw new PiggybankError('El saldo libre no alcanza. Libera dinero de tus alcancías antes de continuar.');
    }
  }
}

// Compare the displayed balance while locked to reject repeated or stale releases.
export function remainingAfterRelease(balance, amount, expectedBalance) {
  if (expectedBalance !== undefined && expectedBalance !== balance) throw new PiggybankError('La alcancía cambió. Cierra y vuelve a abrir para revisar su saldo.');
  let released;
  try { released = toCents(amount); } catch { throw new PiggybankError('Revisa el importe, con hasta dos decimales.'); }
  const available = toCents(balance);
  if (released <= 0n || released > available) throw new PiggybankError('Elige un importe mayor que cero y hasta el saldo de la alcancía.');
  if (expectedBalance === undefined) throw new PiggybankError('Revisa el saldo de la alcancía antes de liberar.');
  return decimal(available - released);
}

export function balanceAfterTopUp(balance, amount) {
  let added;
  try { added = toCents(amount); } catch { throw new PiggybankError('Revisa el importe, con hasta dos decimales.'); }
  if (added <= 0n) throw new PiggybankError('Agrega un importe mayor que cero.');
  const result = decimal(toCents(balance) + added);
  try { toCents(result); } catch { throw new PiggybankError('El saldo de la alcancía supera el importe máximo permitido.'); }
  return result;
}
