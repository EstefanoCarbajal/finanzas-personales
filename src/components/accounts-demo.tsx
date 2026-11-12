'use client';

import { useState, type FormEvent } from 'react';
import AccountsWorkspace, { type Account, type Category } from './accounts-workspace';
import AccountSetupFields from './account-setup-fields';

function DemoSetupForm({ category = false, existing, onCreate }: { category?: boolean; existing: { name: string; kind?: string }[]; onCreate: (name: string, kind: string) => void }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('expense');
  const [feedback, setFeedback] = useState({ message: '', success: false });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) { setFeedback({ message: 'Escribe un nombre de hasta 80 caracteres.', success: false }); return; }
    if (existing.some(item => (!category || item.kind === kind) && item.name.localeCompare(trimmed, 'es', { sensitivity: 'base' }) === 0)) { setFeedback({ message: 'Ya existe un elemento con ese nombre.', success: false }); return; }
    onCreate(trimmed, kind);
    setName('');
    setFeedback({ message: category ? 'Categoría creada.' : 'Cuenta creada.', success: true });
  }
  return <form onSubmit={submit}><AccountSetupFields category={category} name={name} onNameChange={setName} kind={kind} onKindChange={setKind} message={feedback.message} success={feedback.success} /></form>;
}

export default function AccountsDemo({ accounts, categories, balances, balance, onAddAccount, onAddCategory }: {
  accounts: Account[]; categories: Category[]; balances: Record<string, string>; balance: string;
  onAddAccount: (name: string) => void; onAddCategory: (name: string, kind: string) => void;
}) {
  return <AccountsWorkspace accounts={accounts} categories={categories} balances={balances} balance={balance}
    accountForm={<DemoSetupForm existing={accounts} onCreate={onAddAccount} />}
    categoryForm={<DemoSetupForm category existing={categories} onCreate={onAddCategory} />} />;
}
