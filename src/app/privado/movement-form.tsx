'use client';

import { useActionState, useEffect, useState } from 'react';
import { addMovement } from './actions';
import MovementFields, { type MovementAccount, type MovementCategory } from '@/components/movement-fields';
import standard from '@/components/movements.module.css';
import compact from '@/components/movement-modal.module.css';

export default function MovementForm({ accounts, categories, today, requestId, modal = false, onSuccess, onPendingChange }: { accounts: MovementAccount[]; categories: MovementCategory[]; today: string; requestId: string; modal?: boolean; onSuccess?: () => void; onPendingChange?: (pending: boolean) => void }) {
  const s = modal ? compact : standard;
  const [kind, setKind] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [id, setId] = useState(requestId);
  const [state, action, pending] = useActionState(addMovement, { message: '', success: false });
  useEffect(() => {
    if (state.success) { setId(crypto.randomUUID()); setDescription(''); setAmount(''); onSuccess?.(); }
  }, [state, onSuccess]);
  useEffect(() => { onPendingChange?.(pending); }, [pending, onPendingChange]);
  // Preserve all values on errors; clear only description and amount after success.
  return <form action={action} className={s.form} data-kind={kind} onReset={event => event.preventDefault()}>
    <fieldset disabled={pending} className={s.formFields}>
      <input type="hidden" name="request_id" value={id} />
      <MovementFields modal={modal} accounts={accounts} categories={categories} today={today} kind={kind} onKindChange={setKind} description={description} onDescriptionChange={setDescription} amount={amount} onAmountChange={setAmount} />
      {!accounts.length && <p className={s.message}>Crea una cuenta en Cuentas para empezar a registrar.</p>}
      <p className={`${s.message} ${state.success ? s.success : s.error}`} role="status">{modal && state.success ? '' : state.message}</p>
      <button disabled={pending || !accounts.length} className={s.save}>{pending ? 'Guardando…' : modal ? `Guardar ${kind === 'income' ? 'ingreso' : kind === 'transfer' ? 'transferencia' : 'gasto'}` : 'Guardar movimiento'} <span aria-hidden="true">{pending ? '· · ·' : '✓'}</span></button>
      {!modal && <p className={s.formFoot}>Los pagos futuros se organizan en Planificación.</p>}
    </fieldset>
  </form>;
}
