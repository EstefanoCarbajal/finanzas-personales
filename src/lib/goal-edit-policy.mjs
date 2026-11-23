import { decimal, toCents } from './money.mjs';
/** @param {any} input @param {string} today @param {string | null} existingDate */
export function validateGoalEdit(input, today, existingDate = null) {
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.trim().length > 100) throw new Error('Escribe un nombre de meta de hasta 100 caracteres.');
  let amount;
  try { amount = toCents(input.target_amount); if (amount <= 0n) throw new Error(); } catch { throw new Error('Introduce un importe mayor que cero, con hasta dos decimales.'); }
  const target = input.target_on || null;
  if (target) {
    const date = typeof target === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(target) ? new Date(target + 'T00:00:00Z') : null;
    if (!date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== target || (target < today && target !== existingDate)) throw new Error('Elige una fecha objetivo válida, hoy o futura.');
  }
  return { name: input.name.trim(), target_amount: decimal(amount), target_on: target };
}
