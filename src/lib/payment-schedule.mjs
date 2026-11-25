// Each date is anchored to the original day, clamping shorter months.
export function paymentDates(due, count = '1') {
  if (!/^(?:[1-9]|1[0-9]|2[0-4])$/.test(String(count))) throw new Error('Elige entre 1 y 24 meses.');
  const n = Number(count);
  if (!due) {
    if (n !== 1) throw new Error('Para repetir el pago, elige una fecha de vencimiento.');
    return [null];
  }
  const d = new Date(due + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due) || !Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== due) throw new Error('Elige una fecha válida.');
  const year = d.getUTCFullYear(), month = d.getUTCMonth(), day = d.getUTCDate();
  return Array.from({ length: n }, (_, i) => {
    const absolute = year * 12 + month + i, y = Math.floor(absolute / 12), m = absolute % 12;
    if (y > 9999) throw new Error('La serie supera la fecha máxima permitida.');
    const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return String(y).padStart(4, '0') + '-' + String(m + 1).padStart(2, '0') + '-' + String(Math.min(day, last)).padStart(2, '0');
  });
}
