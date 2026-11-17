import test from 'node:test';
import assert from 'node:assert/strict';
import { totals } from '../src/lib/money.mjs';
import { creditCards, validateCard, checkCreditLedger, editCreditCard, deleteCreditCard } from '../src/lib/credit.mjs';

const accounts = [{ id: 'cash', account_type: 'asset' }, { id: 'card', account_type: 'credit', credit_limit: '1000.00', opening_debt: '100.00' }];
const movements = [
  { kind: 'income', account_id: 'cash', amount: '500.00' },
  { kind: 'expense', account_id: 'card', amount: '20.25' },
  { kind: 'transfer', account_id: 'cash', destination_id: 'card', amount: '10.50' },
];
test('credit spending separates cash, expenses, initial debt and repayments exactly', () => {
  assert.deepEqual(totals(movements, accounts), { income: '500.00', expense: '20.25', balance: '489.50', debt: '109.75', net: '379.75', accounts: { card: '-109.75', cash: '489.50' } });
  const [card] = creditCards(accounts, movements);
  assert.equal(card.debt, '109.75'); assert.equal(card.available, '890.25');
  assert.equal(totals([], accounts).expense, '0.00');
  assert.equal(totals([], accounts).balance, '0.00');
  assert.equal(totals([], accounts).net, '-100.00');
});
test('cards validate limits, initial debt and last four without accepting full card numbers', () => {
  const input = { name: '  Mi tarjeta  ', credit_limit: '1000', opening_debt: '12.50', last_four: '0123' };
  assert.deepEqual(validateCard(input), { name: 'Mi tarjeta', credit_limit: '1000.00', opening_debt: '12.50', last_four: '0123' });
  for (const value of [null, { ...input, name: '' }, { ...input, credit_limit: '0' }, { ...input, credit_limit: '100000000000' }, { ...input, opening_debt: '-1' }, { ...input, opening_debt: '1000.01' }, { ...input, last_four: '4111111111111111' }, { ...input, last_four: 'abcd' }]) assert.throws(() => validateCard(value));
});
test('ledger rejects overlimit and overpayment, including changes to earlier movements', async () => {
  const connection = entries => ({ execute: async sql => [sql.includes('FROM accounts') ? accounts.filter(a => a.account_type === 'credit') : entries] });
  await checkCreditLedger(connection(movements), 'owner');
  await assert.rejects(checkCreditLedger(connection([{ kind: 'expense', account_id: 'card', amount: '900.01' }]), 'owner'), /línea/);
  await assert.rejects(checkCreditLedger(connection([{ kind: 'transfer', account_id: 'cash', destination_id: 'card', amount: '100.01' }]), 'owner'), /pago/);
});

test('card edit/delete reject invalid targets before accessing the database', async () => {
  const pool = { getConnection: async () => { throw new Error('Unexpected connection'); } };
  for (const id of ['', null, 'not-a-uuid']) {
    await assert.rejects(editCreditCard(pool, 'owner', id, {}), /tarjeta/);
    await assert.rejects(deleteCreditCard(pool, 'owner', id), /tarjeta/);
  }
});
