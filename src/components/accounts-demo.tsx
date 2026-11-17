'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { decimal, toCents } from '@/lib/money.mjs';
import AccountsWorkspace, { type Account, type Category } from './accounts-workspace';
import AccountSetupFields from './account-setup-fields';
import type { RenameAccount, RemoveAccount } from './account-actions';
import type { EditCategory, RemoveCategory } from './categories-section';

function DemoSetupForm({ category = false, existing, onCreate }: { category?: boolean; existing: { name: string; kind?: string }[]; onCreate: (name: string, kind: string, icon: string, currency?: string, bank?: string, openingBalance?: string) => void }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('expense');
  const [icon, setIcon] = useState('tag');
  const [currency, setCurrency] = useState('PEN');
  const [bank, setBank] = useState('BCP');
  const [openingBalance, setOpeningBalance] = useState('');
  const [feedback, setFeedback] = useState({ message: '', success: false });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) { setFeedback({ message: 'Escribe un nombre de hasta 80 caracteres.', success: false }); return; }
    if (existing.some(item => (!category || item.kind === kind) && item.name.localeCompare(trimmed, 'es', { sensitivity: 'base' }) === 0)) { setFeedback({ message: 'Ya existe un elemento con ese nombre.', success: false }); return; }
    let opening = '0.00';
    try { opening = decimal(toCents(openingBalance || '0')); } catch { setFeedback({ message: 'Escribe un saldo inicial válido con hasta dos decimales.', success: false }); return; }
    onCreate(trimmed, kind, icon, currency, bank, opening);
    setName('');
    setFeedback({ message: category ? 'Categoría creada.' : 'Cuenta creada.', success: true });
  }
  return <form onSubmit={submit}><AccountSetupFields category={category} name={name} onNameChange={setName} currency={currency} onCurrencyChange={setCurrency} bank={bank} onBankChange={setBank} openingBalance={openingBalance} onOpeningBalanceChange={setOpeningBalance} kind={kind} onKindChange={setKind} icon={icon} onIconChange={setIcon} message={feedback.message} success={feedback.success} /></form>;
}

export default function AccountsDemo({ accounts, categories, balances, onAddAccount, onAddCategory, saveOrder, toggleSummaryAccount, editCategory, removeCategory, renameAccount, removeAccount, creditSection, currencyTotals, availableByCurrency }: {
  creditSection: ReactNode; currencyTotals: Record<string, { cash: string; debt: string }>; availableByCurrency: Record<string, string>;
  accounts: Account[]; categories: Category[]; balances: Record<string, string>;
  onAddAccount: (name: string, currency?: string, bank?: string, openingBalance?: string) => void; onAddCategory: (name: string, kind: string, icon: string) => void;
  editCategory: EditCategory; removeCategory: RemoveCategory;
  toggleSummaryAccount: (id: string, selected: boolean) => Promise<{ success: boolean; message: string }>;
  renameAccount: RenameAccount; removeAccount: RemoveAccount;
  saveOrder: (ids: string[]) => Promise<{ success: boolean; message: string }>;
}) {
  return <AccountsWorkspace creditSection={creditSection} currencyTotals={currencyTotals} availableByCurrency={availableByCurrency} accounts={accounts} categories={categories} balances={balances} saveOrder={saveOrder} toggleSummaryAccount={toggleSummaryAccount} editCategory={editCategory} removeCategory={removeCategory} renameAccount={renameAccount} removeAccount={removeAccount}
    accountForm={<DemoSetupForm existing={accounts} onCreate={(name, _kind, _icon, currency, bank, openingBalance) => onAddAccount(name, currency, bank, openingBalance)} />}
    categoryForm={<DemoSetupForm category existing={categories} onCreate={onAddCategory} />} />;
}
