'use client';

import standard from './movements.module.css';
import compact from './movement-modal.module.css';
export type MovementAccount = { id: string; name: string };
export type MovementCategory = MovementAccount & { kind: string };
type Props = { accounts: MovementAccount[]; categories: MovementCategory[]; today: string; kind: string; onKindChange: (kind: string) => void; description: string; onDescriptionChange: (value: string) => void; amount: string; onAmountChange: (value: string) => void; autoFocus?: boolean; modal?: boolean };
const types = [{ value: 'expense', label: 'Gasto', icon: '↗' }, { value: 'income', label: 'Ingreso', icon: '↙' }, { value: 'transfer', label: 'Transferencia', icon: '↔' }];
export default function MovementFields({ accounts, categories, today, kind, onKindChange, description, onDescriptionChange, amount, onAmountChange, autoFocus = false, modal = false }: Props) {
  const s = modal ? compact : standard;
  return <>
    <fieldset className={s.kindOptions}><legend>¿Qué quieres registrar?</legend>{types.map(type => <label className={`${s.kindChoice} ${kind === type.value ? s.chosen : ''} ${s[type.value]}`} key={type.value}><input type="radio" name="kind" value={type.value} checked={kind === type.value} onChange={() => onKindChange(type.value)} /><span aria-hidden="true">{type.icon}</span>{type.label}</label>)}</fieldset>
    <label className={s.amountLabel}>{modal ? '¿Cuánto?' : 'Importe en soles'}<div className={s.amountInput}><span aria-hidden="true">S/</span><input autoFocus={modal} name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="0.00" maxLength={14} value={amount} onChange={event => onAmountChange(event.target.value.replace(',', '.'))} aria-label="Importe en soles" /></div></label>
    <label className={s.descriptionLabel}>Descripción<input autoFocus={autoFocus} name="description" required maxLength={100} placeholder={kind === 'income' ? 'Ej. Mi ingreso del mes' : kind === 'transfer' ? 'Ej. Aporte para mi próximo viaje' : 'Ej. Almuerzo con amigos'} value={description} onChange={event => onDescriptionChange(event.target.value)} /></label>
    <div className={s.fieldPair}><label>{modal ? (kind === 'transfer' ? 'Desde' : 'Cuenta') : `Cuenta de ${kind === 'income' ? 'ingreso' : 'origen'}`}<select name="account_id" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
    {kind === 'transfer' ? <label>{modal ? 'Hacia' : 'Cuenta de destino'}<select name="destination_id" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label> : <label>Categoría<select key={kind} name="category_id" required>{categories.filter(c => c.kind === kind).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}</div>
    <label className={s.dateLabel}>Fecha<input name="occurred_on" type="date" defaultValue={today} min="1900-01-01" max={today} required /></label>
  </>;
}
