import { toCents } from './money.mjs';

/** Aggregate expenses in one currency and civil month using integer cents. */
export function categoryInsights(movements, month, currency) {
  const groups = new Map();
  let total = 0n, count = 0;
  for (const movement of movements) {
    if (movement.kind !== 'expense' || (movement.currency || 'PEN') !== currency || !movement.occurred_on.startsWith(month + '-')) continue;
    const amount = toCents(movement.amount);
    const name = movement.category_name || 'Sin categoría';
    const key = movement.category_id || `name:${name}`;
    const group = groups.get(key) || { key, name, amount: 0n, count: 0 };
    group.amount += amount; group.count++; groups.set(key, group);
    total += amount; count++;
  }
  return { total, count, groups: [...groups.values()].sort((a, b) => a.amount === b.amount ? a.name.localeCompare(b.name, 'es') : a.amount > b.amount ? -1 : 1) };
}

export function previousMonth(month) {
  const [year, number] = month.split('-').map(Number);
  return number === 1 ? `${year - 1}-12` : `${year}-${String(number - 1).padStart(2, '0')}`;
}

export function ratioPercent(value, total) {
  return total ? Number((value * 10000n + total / 2n) / total) / 100 : 0;
}
