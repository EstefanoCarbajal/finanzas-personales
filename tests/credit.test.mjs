import test from 'node:test';
import assert from 'node:assert/strict';
import { totals } from '../src/lib/money.mjs';
import { cardCatalog } from '../src/lib/card-catalog.mjs';
import { creditCards, validateCard, checkCreditLedger, editCreditCard, deleteCreditCard } from '../src/lib/credit.mjs';

const accounts = [{ id: 'cash', account_type: 'asset' }, { id: 'card', account_type: 'credit', credit_limit: '1000.00', opening_debt: '100.00' }];
const movements = [
  { kind: 'income', account_id: 'cash', amount: '500.00' },
  { kind: 'expense', account_id: 'card', amount: '20.25' },
  { kind: 'transfer', account_id: 'cash', destination_id: 'card', amount: '10.50' },
];
test('credit spending separates cash, expenses, initial debt and repayments exactly', () => {
  assert.deepEqual(totals(movements, accounts), {
    income: '500.00', expense: '20.25', balance: '489.50', debt: '109.75', net: '379.75',
    byCurrency: { PEN: { cash: '489.50', debt: '109.75', net: '379.75' } },
    accounts: { card: '-109.75', cash: '489.50' },
  });
  const [card] = creditCards(accounts, movements);
  assert.equal(card.debt, '109.75'); assert.equal(card.available, '890.25');
  assert.equal(totals([], accounts).expense, '0.00');
  assert.equal(totals([], accounts).balance, '0.00');
  assert.equal(totals([], accounts).net, '-100.00');
});
test('cards validate limits, initial debt and last four without accepting full card numbers', () => {
  const input = { name: '  Mi tarjeta  ', credit_limit: '1000', opening_debt: '12.50', last_four: '0123' };
  assert.deepEqual(validateCard(input), { name: 'Mi tarjeta', credit_limit: '1000.00', opening_debt: '12.50', last_four: '0123', bank_code: 'BCP', credit_network: null, credit_model: null });
  for (const value of [null, { ...input, name: '' }, { ...input, credit_limit: '0' }, { ...input, credit_limit: '100000000000' }, { ...input, opening_debt: '-1' }, { ...input, opening_debt: '1000.01' }, { ...input, last_four: '4111111111111111' }, { ...input, last_four: 'abcd' }]) assert.throws(() => validateCard(value));
});

test('every listed card resolves within its issuer and network and fits the stored label', () => {
  const names = new Set();
  for (const { bank, networks } of cardCatalog) {
    for (const { network, models } of networks) {
      for (const model of models) {
        const card = validateCard({ bank_code: bank, network, catalog_model: model, last_four: '0001', credit_limit: '100' });
        assert.equal(card.credit_model, model);
        assert.equal(card.credit_network, network);
        assert.equal(card.bank_code, bank);
        assert.ok(card.name.length <= 80 && !names.has(card.name));
        names.add(card.name);
      }
    }
  }
  const input = { bank_code: 'BCP', network: 'Mastercard', catalog_model: 'Bfree', credit_limit: '100' };
  assert.throws(() => validateCard(input), /modelo/);
  assert.throws(() => validateCard({ ...input, bank_code: 'BBVA', catalog_model: 'Signature' }), /modelo/);
});

test('Otros accepts named banks, networks and custom models, with validation on incomplete choices', () => {
  const input = { bank_code: 'other', other_bank: ' Banco QA ', network: 'other', other_network: 'Red QA', catalog_model: 'other', name: 'Mi tarjeta', credit_limit: '55' };
  const card = validateCard(input);
  assert.equal(card.bank_code, 'Banco QA');
  assert.equal(card.credit_network, 'Red QA');
  assert.equal(card.credit_model, null);
  const edited = validateCard({ name: 'Mi alias', credit_limit: '80' }, card);
  assert.equal(edited.credit_network, 'Red QA');
  assert.equal(edited.bank_code, 'Banco QA');
  for (const partial of [{ other_bank: '' }, { other_bank: 'a'.repeat(25) }, { other_network: '' }, { name: ' ' }, { catalog_model: '' }]) {
    assert.throws(() => validateCard({ ...input, ...partial }));
  }
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
