import { decimal, toCents } from './money.mjs';

export class PiggybankError extends Error {}

export function validatePiggybank(input, today) {
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 60) throw new PiggybankError('Escribe un nombre de hasta 60 caracteres.');
  let amount;
  try { amount = toCents(input.amount); } catch { throw new PiggybankError('Revisa el importe, con hasta dos decimales.'); }
  if (amount <= 0n) throw new PiggybankError('Separa un importe mayor que cero.');
  const target = input.target_on || null;
  if (target) {
    if (typeof target !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(target) || target < today || target > '9999-12-31') throw new PiggybankError('Elige hoy o una fecha futura.');
    const date = new Date(`${target}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== target) throw new PiggybankError('La fecha no existe.');
  }
  return { name: input.name.trim(), amount: decimal(amount), target_on: target };
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
