'use client';

import { cloneElement, isValidElement, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import AccountDetail, { type Piggybank, type PiggybankActions } from './account-detail';
import type { PrivateMovement } from '@/app/privado/movements-table';
import { soles } from '@/lib/money.mjs';
import { accountAllocation } from '@/lib/piggybank-policy.mjs';
import AccountCards from './account-cards';
import s from './accounts.module.css';
import w from './wallet.module.css';
import bankStyle from './account-bank.module.css';
import type { RenameAccount, RemoveAccount } from './account-actions';
import WalletCreateModal, { WalletCreateContext } from './wallet-create-modal';

export type Account = { id: string; name: string; bank_code?: string | null; currency?: string; opening_balance?: string; sort_order?: number | null; summary_selected?: boolean };
const walletMoney = (value: string, currency: string) => currency === 'USD' ? `$ ${value}` : soles(value);

export function AccountIcon({ name = 'wallet' }: { name?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'plus' ? <path d="M12 5v14M5 12h14" /> : name === 'arrow' ? <path d="m7 17 10-10M7 7h10v10" /> : name === 'income' ? <path d="M17 7 7 17M7 7v10h10" /> : name === 'tag' ? <><path d="m20 13-7 7a2 2 0 0 1-3 0l-7-7V4h9l8 7a1.5 1.5 0 0 1 0 2Z" /><circle cx="7.5" cy="8" r=".7" /></> : <><path d="M4 7V5a2 2 0 0 1 2-2h12v4M4 7h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" /><path d="M21 12h-5v5h5" /><path d="M17.5 14.5h.01" /></>}
  </svg>;
}

export default function AccountsWorkspace({ accounts, balances, accountForm, saveOrder, toggleSummaryAccount, renameAccount, removeAccount, creditSection, currencyTotals, availableByCurrency, movements, piggybanks, piggybankActions, today, demo = false }: {
  movements: PrivateMovement[]; piggybanks: Piggybank[]; piggybankActions: PiggybankActions; today: string; demo?: boolean;
  creditSection: ReactNode; currencyTotals: Record<string, { cash: string; debt: string }>; availableByCurrency: Record<string, string>;
  accounts: Account[]; balances: Record<string, string>;
  accountForm: ReactNode;
  renameAccount: RenameAccount; removeAccount: RemoveAccount;
  saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>;
  toggleSummaryAccount: (id: string, selected: boolean) => Promise<{ success: boolean; message: string }>;
}) {
  const [currency, setCurrency] = useState('PEN');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountPending, setAccountPending] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const lastAccount = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (selectedAccount) {
      container.current?.querySelector<HTMLElement>('#account-detail-title')?.focus({ preventScroll: true });
      container.current?.scrollIntoView({ block: 'start' });
    }
    else if (lastAccount.current) container.current?.querySelector<HTMLElement>(`[data-account-card="${lastAccount.current}"]`)?.focus({ preventScroll: true });
  }, [selectedAccount]);
  const [selectionOverrides, setSelectionOverrides] = useState<Record<string, boolean>>({});
  const accountsWithSelection = accounts.map(account => ({ ...account, summary_selected: selectionOverrides[account.id] ?? account.summary_selected ?? true }));
  const visibleAccounts = accountsWithSelection.filter(account => (account.currency || 'PEN') === currency);
  const selectedAccounts = visibleAccounts.filter(account => account.summary_selected !== false);
  const freeBalances = Object.fromEntries(accounts.map(account => [account.id, accountAllocation(balances[account.id] || '0.00', piggybanks.filter(bank => bank.account_id === account.id)).free]));
  const favoritesTotal = selectedAccounts.reduce((sum, account) => sum + BigInt((balances[account.id] || '0.00').replace('.', '')), BigInt(0));
  const favoriteAmount = `${favoritesTotal < 0 ? '-' : ''}${((favoritesTotal < 0 ? -favoritesTotal : favoritesTotal) / BigInt(100)).toString()}.${((favoritesTotal < 0 ? -favoritesTotal : favoritesTotal) % BigInt(100)).toString().padStart(2, '0')}`;
  const bankGroups = [...new Set(visibleAccounts.map(account => account.bank_code || 'Sin banco'))];
  const selectedTotals = currencyTotals[currency] || { cash: '0.00', debt: '0.00' };
  const selectedAvailable = availableByCurrency[currency] || '0.00';
  const filteredCreditSection = isValidElement(creditSection) ? cloneElement(creditSection as ReactElement<{ currency?: string }>, { currency }) : creditSection;
  async function toggleSelection(id: string, selected: boolean) {
    const previous = accountsWithSelection.find(account => account.id === id)?.summary_selected ?? true;
    setSelectionOverrides(current => ({ ...current, [id]: selected }));
    try {
      const result = await toggleSummaryAccount(id, selected);
      if (!result.success) setSelectionOverrides(current => ({ ...current, [id]: previous }));
      return result;
    } catch {
      setSelectionOverrides(current => ({ ...current, [id]: previous }));
      return { success: false, message: 'No pudimos actualizar el total de cuentas.' };
    }
  }
  const active = accounts.find(account => account.id === selectedAccount);
  if (active) return <div ref={container}><AccountDetail key={active.id} account={active} balance={balances[active.id] || '0.00'} movements={movements} banks={piggybanks.filter(bank => bank.account_id === active.id)} today={today} actions={piggybankActions} demo={demo} onBack={() => setSelectedAccount(null)} /></div>;
  return <div ref={container} className={s.workspace}>
    <WalletCreateModal open={creatingAccount} onClose={() => setCreatingAccount(false)} pending={accountPending} kind="account"><WalletCreateContext.Provider value={{ finish: () => setCreatingAccount(false), setPending: setAccountPending }}><div className={s.newAccountForm}>{accountForm}</div></WalletCreateContext.Provider></WalletCreateModal>
    <section className={w.wallet} aria-labelledby="wallet-title">
      <div className={w.heading}><div className={w.title}><span className={w.walletIcon}><AccountIcon /></span><h1 id="wallet-title">Tu billetera</h1></div><div className={w.currency} role="group" aria-label="Filtrar por moneda"><button type="button" className={currency === 'PEN' ? w.activeCurrency : ''} aria-pressed={currency === 'PEN'} onClick={() => setCurrency('PEN')}>PEN</button><span aria-hidden="true">·</span><button type="button" className={currency === 'USD' ? w.activeCurrency : ''} aria-pressed={currency === 'USD'} onClick={() => setCurrency('USD')}>USD</button></div></div>
      <dl className={w.overview}><div className={w.cashTotal}><dt>En tus cuentas</dt><dd key={`${currency}-${favoriteAmount}`}>{walletMoney(favoriteAmount, currency)}</dd></div><div><dt>Deuda en tarjetas</dt><dd>{walletMoney(selectedTotals.debt, currency)}</dd></div><div><dt>Crédito</dt><dd>{walletMoney(selectedAvailable, currency)}</dd></div></dl>
      <div className={w.groups}>
      <section className={w.cashGroup} aria-labelledby="accounts-list-title">
      <header className={w.groupHeading}>
        <div><span className={w.groupIcon}><AccountIcon /></span><h2 id="accounts-list-title">Cuentas <span className={w.count}>{visibleAccounts.length}</span></h2></div>
        <div className={w.accountActions}>
          {visibleAccounts.length > 0 && <button type="button" className={`${w.reorderButton} ${reordering ? w.reorderActive : ''}`} aria-pressed={reordering} onClick={() => setReordering(value => !value)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 12V5a2 2 0 0 1 4 0v5-3a2 2 0 0 1 4 0v4-2a2 2 0 0 1 4 0v5c0 4-2.5 7-6.5 7h-1c-2 0-3.3-.7-4.5-2L4 15a2 2 0 0 1 3-2.5L8 14" /></svg><span>{reordering ? 'Listo' : 'Ordenar'}</span></button>}
          <button type="button" className={w.createAccount} aria-haspopup="dialog" onClick={() => setCreatingAccount(true)}>
            <AccountIcon name="plus" /> Nueva cuenta
          </button>
        </div>
      </header>
      {bankGroups.map(bank => <div key={bank} data-bank={bank} className={`${w.bankGroup} ${bankStyle.palette}`}><h3 className={w.bankTitle}><span className={bankStyle.swatch} aria-hidden="true" />{bank}</h3><AccountCards accounts={visibleAccounts.filter(account => (account.bank_code || 'Sin banco') === bank)} balances={balances} freeBalances={freeBalances} saveOrder={saveOrder} toggleSummaryAccount={toggleSelection} renameAccount={renameAccount} removeAccount={removeAccount} reordering={reordering} onOpenAccount={id => { lastAccount.current = id; setSelectedAccount(id); }} /></div>)}
      </section>
      <div className={w.creditGroup}>{filteredCreditSection}</div>
      </div>
    </section>

  </div>;
}
