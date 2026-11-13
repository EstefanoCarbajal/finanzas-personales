'use client';

import { useState, type FormEvent } from 'react';
import { toCents } from '@/lib/money.mjs';
import MovementFields, { type MovementAccount, type MovementCategory } from './movement-fields';
import standard from './movements.module.css';
import compact from './movement-modal.module.css';

export type DemoMovementDraft = { name: string; category: string; amount: number; date: string; kind: string; account: string; destination: string | null };
export const demoAccounts = [{ id: 'cash', name: 'Efectivo' }, { id: 'savings', name: 'Ahorros' }];
export const demoCategories = [...['Alimentación', 'Transporte', 'Vivienda', 'Ocio', 'Salud', 'Otros'].map((name, i) => ({ id: `expense-${i}`, name, kind: 'expense' })), { id: 'income', name: 'Ingresos', kind: 'income' }];
export default function DemoMovementForm({ onAdd, autoFocus = false, accounts = demoAccounts, categories = demoCategories, modal = false }: { onAdd: (movement: DemoMovementDraft) => void; autoFocus?: boolean; accounts?: MovementAccount[]; categories?: MovementCategory[]; modal?: boolean }) {
  const s = modal ? compact : standard;
  const [kind, setKind] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    const data = new FormData(event.currentTarget);
    let cents: bigint;
    try { cents = toCents(amount); } catch { setMessage('Escribe un importe válido con hasta dos decimales.'); return; }
    if (cents <= BigInt(0)) { setMessage('El importe debe ser mayor que cero.'); return; }
    const account = accounts.find(a => a.id === data.get('account_id'));
    const destination = accounts.find(a => a.id === data.get('destination_id'));
    const category = categories.find(c => c.id === data.get('category_id') && c.kind === kind);
    if (!account || (kind === 'transfer' && (!destination || destination.id === account.id))) { setMessage('Elige una cuenta de destino diferente a la de origen.'); return; }
    if (!description.trim() || (kind !== 'transfer' && !category)) { setMessage('Revisa la descripción y la categoría.'); return; }
    const date = String(data.get('occurred_on'));
    if (date < '1900-01-01' || date > '2026-11-11' || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) { setMessage('Elige una fecha válida hasta el 11 de noviembre de 2026.'); return; }
    onAdd({ name: description.trim(), category: category?.name || 'Transferencia', amount: Number(cents) * (kind === 'expense' ? -1 : 1), date, kind, account: account.name, destination: destination?.name || null });
    setDescription(''); setAmount(''); setSuccess(true); setMessage('¡Listo! Movimiento añadido a la demo. Se reinicia al recargar.');
  }
  return <form className={s.form} data-kind={kind} onSubmit={submit} onReset={event => event.preventDefault()}><div className={s.formFields}>
    <MovementFields modal={modal} autoFocus={autoFocus} accounts={accounts} categories={categories} today="2026-11-11" kind={kind} onKindChange={setKind} description={description} onDescriptionChange={setDescription} amount={amount} onAmountChange={setAmount} />
    <p className={`${s.message} ${success ? s.success : s.error}`} role="status">{modal && success ? '' : message}</p><button className={s.save}>{modal ? `Añadir ${kind === 'income' ? 'ingreso' : kind === 'transfer' ? 'transferencia' : 'gasto'}` : 'Añadir a la demo'} <span aria-hidden="true">✓</span></button><p className={s.formFoot}>{modal ? 'Datos ficticios · Se reinician al recargar' : 'Solo datos ficticios. Nada se guarda fuera de esta página.'}</p>
  </div></form>;
}
