'use client';

import { useActionState, useState } from 'react';
import { addAccount, addCategory } from './actions';
import AccountSetupFields from '@/components/account-setup-fields';

const initial = { message: '', success: false };

export default function SetupForms({ category = false }: { category?: boolean }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('expense');
  const [icon, setIcon] = useState('tag');
  const [currency, setCurrency] = useState('PEN');
  const [bank, setBank] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [state, action, pending] = useActionState(async (previous: typeof initial, form: FormData) => {
    const result = await (category ? addCategory : addAccount)(previous, form);
    if (result.success) { setName(''); setCurrency('PEN'); setBank(''); setOpeningBalance(''); }
    return result;
  }, initial);

  return <form action={action}>
    <AccountSetupFields category={category} name={name} onNameChange={setName} currency={currency} onCurrencyChange={setCurrency} bank={bank} onBankChange={setBank} openingBalance={openingBalance} onOpeningBalanceChange={setOpeningBalance} kind={kind} onKindChange={setKind} icon={icon} onIconChange={setIcon} pending={pending} message={state.message} success={state.success} />
  </form>;
}
