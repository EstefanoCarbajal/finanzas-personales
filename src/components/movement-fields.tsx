'use client';

import { useState } from 'react';
import standard from './movements.module.css';
import compact from './movement-modal.module.css';
export type MovementAccount = { id: string; name: string; currency?: string; account_type?: string; credit_limit?: string; opening_debt?: string; last_four?: string | null };
export type MovementCategory = MovementAccount & { kind: string };
type Props = { accounts: MovementAccount[]; categories: MovementCategory[]; today: string; kind: string; onKindChange: (kind: string) => void; description: string; onDescriptionChange: (value: string) => void; amount: string; onAmountChange: (value: string) => void; accountId?: string; destinationId?: string | null; categoryId?: string | null; occurredOn?: string; autoFocus?: boolean; modal?: boolean };
const types = [{ value: 'expense', label: 'Gasto', icon: '↗' }, { value: 'income', label: 'Ingreso', icon: '↙' }, { value: 'transfer', label: 'Transferencia', icon: '↔' }];
export default function MovementFields({ accounts, categories, today, kind, onKindChange, description, onDescriptionChange, amount, onAmountChange, accountId, destinationId, categoryId, occurredOn, autoFocus = false, modal = false }: Props) {
  const s = modal ? compact : standard;
  const [source, setSource] = useState(accountId || accounts[0]?.id || '');
  const sources = accounts.filter(a => kind === 'expense' || a.account_type !== 'credit');
  const selectedSource = sources.find(a => a.id === source) || sources[0];
  const sourceId = selectedSource?.id || '';
  const destinations = accounts.filter(a => a.id !== sourceId);
  return <>
    <fieldset className={s.kindOptions}><legend>¿Qué quieres registrar?</legend>{types.map(type => <label className={`${s.kindChoice} ${kind === type.value ? s.chosen : ''} ${s[type.value]}`} key={type.value}><input type="radio" name="kind" value={type.value} checked={kind === type.value} onChange={() => onKindChange(type.value)} /><span aria-hidden="true">{type.icon}</span>{type.label}</label>)}</fieldset>
    <label className={s.amountLabel}>{!modal && `Importe en ${selectedSource?.currency || 'PEN'}`}<div className={s.amountInput}><span aria-hidden="true">{selectedSource?.currency === 'USD' ? '$' : 'S/'}</span><input autoFocus={modal} name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="0.00" maxLength={14} value={amount} onChange={event => onAmountChange(event.target.value.replace(',', '.'))} aria-label={`Importe en ${selectedSource?.currency || 'PEN'}`} /></div></label>
    <label className={s.descriptionLabel}>Descripción<input autoFocus={autoFocus} name="description" required maxLength={100} placeholder={kind === 'income' ? 'Ej. Mi ingreso del mes' : kind === 'transfer' ? 'Ej. Aporte para mi próximo viaje' : 'Ej. Almuerzo con amigos'} value={description} onChange={event => onDescriptionChange(event.target.value)} /></label>
    <div className={s.fieldPair}><label>{modal ? (kind === 'transfer' ? 'Desde' : kind === 'expense' ? 'Pagar con' : 'Cuenta') : `Medio de ${kind === 'income' ? 'ingreso' : 'origen'}`}<select name="account_id" required value={sourceId} onChange={event => setSource(event.target.value)}>{sources.map(a => <option key={a.id} value={a.id}>{a.account_type === "credit" ? "Tarjeta · " : ""}{a.name} · {a.currency || 'PEN'}</option>)}</select></label>
    {kind === 'transfer' ? <label>{modal ? 'Hacia' : 'Cuenta o tarjeta de destino'}<select name="destination_id" required defaultValue={destinationId || undefined}>{destinations.map(a => <option key={a.id} value={a.id}>{a.account_type === "credit" ? "Pagar tarjeta · " : ""}{a.name}</option>)}</select></label> : <label>Categoría<select key={kind} name="category_id" required defaultValue={categoryId || undefined}>{categories.filter(c => c.kind === kind).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}</div>
    {selectedSource?.account_type === "credit" && <p className={s.message}>Compra con crédito: aumenta tu deuda, sin descontar dinero de tus cuentas.</p>}
    {kind === "transfer" && accounts.some(a => a.account_type === "credit") && <p className={s.message}>Para pagar una tarjeta, elígela como destino. No se contará como otro gasto.</p>}
    <label className={s.dateLabel}>Fecha<input name="occurred_on" type="date" defaultValue={occurredOn || today} min="1900-01-01" max={today} required /></label>
  </>;
}
