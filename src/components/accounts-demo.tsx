'use client';

import type { ReactNode } from 'react';
import AccountsWorkspace, { type Account } from './accounts-workspace';
import DemoSetupForm from './demo-setup-form';
import type { RenameAccount, RemoveAccount } from './account-actions';
import type { PrivateMovement } from '@/app/privado/movements-table';
import type { Piggybank, PiggybankActions } from './account-detail';

export default function AccountsDemo({ accounts, balances, onAddAccount, saveOrder, toggleSummaryAccount, renameAccount, removeAccount, creditSection, currencyTotals, availableByCurrency, movements, piggybanks, piggybankActions }: {
  movements: PrivateMovement[]; piggybanks: Piggybank[]; piggybankActions: PiggybankActions;
  creditSection: ReactNode; currencyTotals: Record<string, { cash: string; debt: string }>; availableByCurrency: Record<string, string>;
  accounts: Account[]; balances: Record<string, string>;
  onAddAccount: (name: string, currency?: string, bank?: string, openingBalance?: string) => void;
  toggleSummaryAccount: (id: string, selected: boolean) => Promise<{ success: boolean; message: string }>;
  renameAccount: RenameAccount; removeAccount: RemoveAccount;
  saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>;
}) {
  return <AccountsWorkspace demo today="2026-11-11" movements={movements} piggybanks={piggybanks} piggybankActions={piggybankActions} creditSection={creditSection} currencyTotals={currencyTotals} availableByCurrency={availableByCurrency} accounts={accounts} balances={balances} saveOrder={saveOrder} toggleSummaryAccount={toggleSummaryAccount} renameAccount={renameAccount} removeAccount={removeAccount}
    accountForm={<DemoSetupForm existing={accounts} onCreate={(name, _kind, _icon, currency, bank, openingBalance) => onAddAccount(name, currency, bank, openingBalance)} />} />;
}
