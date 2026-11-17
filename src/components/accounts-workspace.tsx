'use client';

import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { soles } from '@/lib/money.mjs';
import AccountCards from './account-cards';
import s from './accounts.module.css';
import w from './wallet.module.css';
import CategoriesSection, { type EditCategory, type RemoveCategory } from './categories-section';
import type { RenameAccount, RemoveAccount } from './account-actions';

export type Account = { id: string; name: string; bank_code?: string | null; currency?: string; opening_balance?: string; sort_order?: number | null };
export type Category = Account & { kind: string; icon?: string | null };
const walletMoney = (value: string, currency: string) => currency === 'USD' ? `$ ${value}` : soles(value);

export function AccountIcon({ name = 'wallet' }: { name?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'plus' ? <path d="M12 5v14M5 12h14" /> : name === 'arrow' ? <path d="m7 17 10-10M7 7h10v10" /> : name === 'income' ? <path d="M17 7 7 17M7 7v10h10" /> : name === 'tag' ? <><path d="m20 13-7 7a2 2 0 0 1-3 0l-7-7V4h9l8 7a1.5 1.5 0 0 1 0 2Z" /><circle cx="7.5" cy="8" r=".7" /></> : <><path d="M4 7V5a2 2 0 0 1 2-2h12v4M4 7h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" /><path d="M21 12h-5v5h5" /><path d="M17.5 14.5h.01" /></>}
  </svg>;
}

export default function AccountsWorkspace({ accounts, categories, balances, accountForm, categoryForm, saveOrder, editCategory, removeCategory, renameAccount, removeAccount, creditSection, currencyTotals, availableByCurrency }: {
  creditSection: ReactNode; currencyTotals: Record<string, { cash: string; debt: string }>; availableByCurrency: Record<string, string>;
  accounts: Account[]; categories: Category[]; balances: Record<string, string>;
  accountForm: ReactNode; categoryForm: ReactNode; editCategory: EditCategory; removeCategory: RemoveCategory;
  renameAccount: RenameAccount; removeAccount: RemoveAccount;
  saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>;
}) {
  const [currency, setCurrency] = useState('PEN');
  const visibleAccounts = accounts.filter(account => (account.currency || 'PEN') === currency);
  const bankGroups = [...new Set(visibleAccounts.map(account => account.bank_code || 'Otro banco'))];
  const selectedTotals = currencyTotals[currency] || { cash: '0.00', debt: '0.00' };
  const selectedAvailable = availableByCurrency[currency] || '0.00';
  const filteredCreditSection = isValidElement(creditSection) ? cloneElement(creditSection as ReactElement<{ currency?: string }>, { currency }) : creditSection;
  const creationCard = <details className={s.newAccountCard}><summary><span className={s.newCardArt} aria-hidden="true"><span><AccountIcon name="plus" /></span></span><strong>Nueva cuenta</strong><span className={s.newCardToggle} aria-hidden="true">⌄</span></summary><div className={s.newAccountForm}>{accountForm}</div></details>;
  return <div className={s.workspace}>
    <section className={w.wallet} aria-labelledby="wallet-title">
      <div className={w.heading}><div className={w.title}><span className={w.walletIcon}><AccountIcon /></span><h1 id="wallet-title">Tu billetera</h1></div><div className={w.currency} role="group" aria-label="Filtrar por moneda"><button type="button" className={currency === 'PEN' ? w.activeCurrency : ''} aria-pressed={currency === 'PEN'} onClick={() => setCurrency('PEN')}>PEN</button><span aria-hidden="true">·</span><button type="button" className={currency === 'USD' ? w.activeCurrency : ''} aria-pressed={currency === 'USD'} onClick={() => setCurrency('USD')}>USD</button></div></div>
      <dl className={w.overview}><div className={w.cashTotal}><dt>En tus cuentas</dt><dd>{walletMoney(selectedTotals.cash, currency)}</dd></div><div><dt>Deuda en tarjetas</dt><dd>{walletMoney(selectedTotals.debt, currency)}</dd></div><div><dt>Crédito</dt><dd>{walletMoney(selectedAvailable, currency)}</dd></div></dl>
      <div className={w.groups}>
      <section className={w.cashGroup} aria-labelledby="accounts-list-title">
      <div className={w.groupHeading}><div><span className={w.groupIcon}><AccountIcon /></span><h2 id="accounts-list-title">Cuentas <span className={w.count}>{visibleAccounts.length}</span></h2></div><span className={w.groupTag}>Tu dinero</span></div>
      {bankGroups.map(bank => <div key={bank} className={w.bankGroup}><h3 className={w.bankTitle}>{bank}</h3><AccountCards accounts={visibleAccounts.filter(account => (account.bank_code || 'Otro banco') === bank)} balances={balances} saveOrder={saveOrder} renameAccount={renameAccount} removeAccount={removeAccount} creationCard={bank === bankGroups[bankGroups.length - 1] ? creationCard : null} /></div>)}
      {!bankGroups.length && creationCard}
      </section>
      <div className={w.creditGroup}>{filteredCreditSection}</div>
      </div>
    </section>

    <CategoriesSection categories={categories} creation={categoryForm} editCategory={editCategory} removeCategory={removeCategory} />
  </div>;
}
