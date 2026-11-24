import test from 'node:test';
import assert from 'node:assert/strict';
import { orderedAccounts, reorderBankAccounts, reorderBanks } from '../src/lib/wallet-order.mjs';

const accounts = [
  { id: 'a', bank_code: 'BCP', currency: 'PEN' },
  { id: 'b', bank_code: 'Otro', currency: 'PEN' },
  { id: 'c', bank_code: 'BCP', currency: 'USD' },
  { id: 'd', bank_code: null, currency: 'PEN' },
  { id: 'e', bank_code: 'BCP', currency: 'PEN' },
];

test('mover bancos conserva todas las cuentas y el orden interno incluso entre monedas', () => {
  const ids = reorderBanks(accounts, 'Otro', 'BCP');
  assert.deepEqual(ids, ['b', 'a', 'c', 'e', 'd']);
  assert.deepEqual(orderedAccounts(accounts, ids).map(account => account.id), ids);
  assert.deepEqual(reorderBanks(orderedAccounts(accounts, ids), 'Sin banco', 'BCP'), ['b', 'd', 'a', 'c', 'e']);
});

test('ordenar cuentas de un banco conserva cuentas ajenas y rechaza conjuntos incompletos', () => {
  assert.deepEqual(reorderBankAccounts(accounts, 'BCP', ['e', 'c', 'a']), ['e', 'b', 'c', 'd', 'a']);
  assert.throws(() => reorderBankAccounts(accounts, 'BCP', ['a', 'a', 'c']));
  assert.throws(() => reorderBankAccounts(accounts, 'BCP', ['a', 'c']));
});
