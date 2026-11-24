import { decimal, toCents } from './money.mjs';

/** Sum the displayed payments in integer cents, keeping currencies separate. */
export function paymentTotals(payments) {
  const totals = new Map();
  for (const payment of payments) {
    const currency = payment.currency || 'PEN';
    totals.set(currency, (totals.get(currency) ?? 0n) + toCents(payment.amount));
  }
  return [...totals].sort(([a], [b]) => a.localeCompare(b)).map(([currency, amount]) => ({ currency, amount: decimal(amount) }));
}
