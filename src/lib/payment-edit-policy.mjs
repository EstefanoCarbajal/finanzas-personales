import { decimal, toCents } from './money.mjs';
/** @param {any} input @param {string} today @param {string | null} existingDate @param {Date} now */
export function validatePaymentEdit(input, today, existingDate = null, now = new Date()) {
  if (!input || typeof input.description !== 'string' || !input.description.trim() || input.description.trim().length > 100) throw new Error('Escribe una descripción de hasta 100 caracteres.');
  let cents;
  try { cents = toCents(input.amount); if (cents <= 0n) throw new Error(); } catch { throw new Error('Introduce un importe mayor que cero, con hasta dos decimales.'); }
  const due = input.due_on || null;
  const date = typeof due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(due) ? new Date(due + 'T00:00:00Z') : null;
  if (due && (!date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== due || (due < today && due !== existingDate))) throw new Error('Elige una fecha válida, hoy o futura.');
  if (!['manual', 'automatic'].includes(input.payment_mode)) throw new Error('Elige el modo manual o automático.');
  let automatic_at = null;
  if (input.payment_mode === 'automatic') {
    if (!due) throw new Error('El registro automático requiere una fecha de vencimiento.');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.automatic_time || '')) throw new Error('Elige una hora válida de Lima.');
    const time = new Date(due + 'T' + input.automatic_time + ':00-05:00');
    if (time <= now) throw new Error('El registro automático debe programarse para una hora futura de Lima.');
    automatic_at = time.toISOString().slice(0,19).replace('T',' ');
  }
  return { description: input.description.trim(), amount: decimal(cents), due_on: due, automatic_at };
}
