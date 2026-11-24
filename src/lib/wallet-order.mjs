export const bankOf = account => account.bank_code || 'Sin banco';

export function orderedAccounts(accounts, ids) {
  const byId = new Map(accounts.map(account => [account.id, account]));
  return [...ids.map(id => byId.get(id)).filter(Boolean), ...accounts.filter(account => !ids.includes(account.id))];
}

export function reorderBankAccounts(accounts, bank, ids) {
  const members = accounts.filter(account => bankOf(account) === bank);
  const inGroup = new Set(members.map(account => account.id));
  const replacement = ids.filter(id => inGroup.has(id));
  if (replacement.length !== members.length || new Set(replacement).size !== members.length) throw new Error('Las cuentas cambiaron. Actualiza la página.');
  let index = 0;
  return accounts.map(account => inGroup.has(account.id) ? replacement[index++] : account.id);
}

export function reorderBanks(accounts, bank, target) {
  const banks = [...new Set(accounts.map(bankOf))];
  const from = banks.indexOf(bank), to = banks.indexOf(target);
  if (from < 0 || to < 0 || from === to) return accounts.map(account => account.id);
  banks.splice(from, 1);
  banks.splice(to, 0, bank);
  return banks.flatMap(name => accounts.filter(account => bankOf(account) === name).map(account => account.id));
}
