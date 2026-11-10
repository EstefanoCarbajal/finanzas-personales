/** Convert a decimal string to integer cents, without floating point arithmetic. */
export function toCents(value) {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,10})(\.\d{1,2})?$/.test(value)) {
    throw new Error('Introduce un importe válido con hasta dos decimales.');
  }
  const [whole, fraction = ''] = value.split('.');
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
}

export function decimal(cents) {
  const sign = cents < 0n ? '-' : '';
  const value = cents < 0n ? -cents : cents;
  return `${sign}${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}

export function soles(value) {
  const [whole, fraction] = value.split('.');
  const negativeZero = whole === '-0' ? '-' : '';
  return `S/ ${negativeZero}${BigInt(whole).toLocaleString('es-PE')}.${fraction}`;
}

/** Transfers change account balances but never income or expenses. */
export function totals(movements) {
  let income = 0n, expense = 0n;
  const balances = new Map();
  const add = (id, value) => balances.set(id, (balances.get(id) ?? 0n) + value);
  for (const movement of movements) {
    const cents = toCents(movement.amount);
    if (movement.kind === 'income') { income += cents; add(movement.account_id, cents); }
    else if (movement.kind === 'expense') { expense += cents; add(movement.account_id, -cents); }
    else if (movement.kind === 'transfer') {
      add(movement.account_id, -cents); add(movement.destination_id, cents);
    } else throw new Error('Tipo de movimiento inválido.');
  }
  return { income: decimal(income), expense: decimal(expense), balance: decimal(income - expense),
    accounts: Object.fromEntries([...balances].map(([id, value]) => [id, decimal(value)])) };
}
