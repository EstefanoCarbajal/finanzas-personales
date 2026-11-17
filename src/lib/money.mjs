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
export function totals(movements, accounts) {
  let income = 0n, expense = 0n;
  const balances = new Map();
  const add = (id, value) => balances.set(id, (balances.get(id) ?? 0n) + value);
  if (accounts) for (const account of accounts) {
    if (account.account_type === 'credit') add(account.id, -toCents(account.opening_debt || '0.00'));
    else add(account.id, toCents(account.opening_balance || '0.00'));
  }
  for (const movement of movements) {
    const cents = toCents(movement.amount);
    if (movement.kind === 'income') { income += cents; add(movement.account_id, cents); }
    else if (movement.kind === 'expense') { expense += cents; add(movement.account_id, -cents); }
    else if (movement.kind === 'transfer') {
      add(movement.account_id, -cents); add(movement.destination_id, cents);
    } else throw new Error('Tipo de movimiento inválido.');
  }
  if (accounts) {
    const cardIds = new Set(accounts.filter(a => a.account_type === 'credit').map(a => a.id));
    let cash = 0n, debt = 0n;
    const byCurrency = {};
    for (const [id, balance] of balances) {
      const account = accounts.find(a => a.id === id); const currency = account?.currency || 'PEN';
      byCurrency[currency] = byCurrency[currency] || { cash: 0n, debt: 0n };
      if (cardIds.has(id)) { debt -= balance; byCurrency[currency].debt -= balance; } else { cash += balance; byCurrency[currency].cash += balance; }
    }
    return { income: decimal(income), expense: decimal(expense), balance: decimal(cash), debt: decimal(debt), net: decimal(cash - debt), byCurrency: Object.fromEntries(Object.entries(byCurrency).map(([currency, v]) => [currency, { cash: decimal(v.cash), debt: decimal(v.debt), net: decimal(v.cash - v.debt) }])),
      accounts: Object.fromEntries([...balances].map(([id, value]) => [id, decimal(value)])) };
  }
  return { income: decimal(income), expense: decimal(expense), balance: decimal(income - expense),
    accounts: Object.fromEntries([...balances].map(([id, value]) => [id, decimal(value)])) };
}
