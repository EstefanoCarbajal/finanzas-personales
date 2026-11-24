'use client';

import { useState, type FormEvent } from 'react';
import { decimal, toCents } from '@/lib/money.mjs';
import AccountSetupFields from './account-setup-fields';
import { useWalletCreate } from './wallet-create-modal';

type SetupProps = { existing: { name: string; kind?: string }[] } & (
  | { category: true; onCreate: (name: string, kind: string, icon: string, color: string | null) => void }
  | { category?: false; onCreate: (name: string, currency: string, bank: string, openingBalance: string) => void }
);

export default function DemoSetupForm(props: SetupProps) {
  const { category, existing } = props;
  const modal = useWalletCreate();
  const [name, setName] = useState('');
  const [kind, setKind] = useState('expense');
  const [icon, setIcon] = useState('tag');
  const [currency, setCurrency] = useState('PEN');
  const [bank, setBank] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [feedback, setFeedback] = useState({ message: '', success: false });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 80) { setFeedback({ message: 'Escribe un nombre de hasta 80 caracteres.', success: false }); return; }
    if (existing.some(item => (!category || item.kind === kind) && item.name.localeCompare(trimmed, 'es', { sensitivity: 'base' }) === 0)) { setFeedback({ message: 'Ya existe un elemento con ese nombre.', success: false }); return; }
    let opening = '0.00';
    try { opening = decimal(toCents(openingBalance || '0')); } catch { setFeedback({ message: 'Escribe un saldo inicial válido con hasta dos decimales.', success: false }); return; }
    if (props.category) {
      const color = new FormData(event.currentTarget).get('color');
      props.onCreate(trimmed, kind, icon, typeof color === 'string' && color !== 'auto' ? color : null);
    } else {
      props.onCreate(trimmed, currency, bank, opening);
    }
    setName('');
    if (!category) {
      setBank(''); setCurrency('PEN'); setOpeningBalance('');
      modal?.finish();
    }
    setFeedback({ message: category ? 'Categoría creada.' : 'Cuenta creada.', success: true });
  }
  return <form onSubmit={submit}><AccountSetupFields category={category} name={name} onNameChange={setName} currency={currency} onCurrencyChange={setCurrency} bank={bank} onBankChange={setBank} openingBalance={openingBalance} onOpeningBalanceChange={setOpeningBalance} kind={kind} onKindChange={setKind} icon={icon} onIconChange={setIcon} message={feedback.message} success={feedback.success} /></form>;
}

