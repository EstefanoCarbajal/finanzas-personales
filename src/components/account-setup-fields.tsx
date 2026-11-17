import s from './accounts.module.css';
import CategoryFields from './category-fields';
import { BANK_GROUPS } from '@/lib/banks.mjs';

export default function AccountSetupFields({ category = false, name, onNameChange, kind, onKindChange, icon, onIconChange, currency = 'PEN', onCurrencyChange, bank = '', onBankChange, openingBalance = '', onOpeningBalanceChange, pending = false, message = '', success = false }: {
  category?: boolean; name: string; onNameChange: (name: string) => void; kind?: string; onKindChange?: (kind: string) => void;
  pending?: boolean; message?: string; success?: boolean;
  icon?: string; onIconChange?: (icon: string) => void; currency?: string; onCurrencyChange?: (currency: string) => void; bank?: string; onBankChange?: (bank: string) => void; openingBalance?: string; onOpeningBalanceChange?: (value: string) => void;
}) {
  if (category) return <CategoryFields name={name} onNameChange={onNameChange} kind={kind} onKindChange={onKindChange} icon={icon} onIconChange={onIconChange} pending={pending} message={message} success={success} />;
  const id = 'new-account';
  return <>
    <fieldset className={s.formFields} disabled={pending}>
      <label htmlFor={id}>Nombre<input id={id} name="name" aria-label="Nombre de la cuenta" required maxLength={80} value={name} onChange={event => onNameChange(event.target.value)} placeholder="Ej. Cuenta sueldo" aria-describedby={`${id}-feedback`} /></label>
      <label>Moneda<select name="currency" value={currency} onChange={event => onCurrencyChange?.(event.target.value)}><option value="PEN">PEN · Soles</option><option value="USD">USD · Dólares</option></select></label>
      <label>Banco<select name="bank_code" required value={bank} onChange={event => onBankChange?.(event.target.value)}><option value="">Selecciona tu banco</option>{BANK_GROUPS.map(group => <optgroup key={group.label} label={group.label}>{group.options.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</optgroup>)}</select></label>
      <label>Saldo inicial · {currency === 'USD' ? '$' : 'S/'}<input name="opening_balance" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" maxLength={14} value={openingBalance} onChange={event => onOpeningBalanceChange?.(event.target.value.replace(',', '.'))} placeholder="0.00" /></label>
      <button type="submit" className={s.submit}>{pending ? 'Guardando…' : 'Crear'}<span aria-hidden="true">{pending ? '…' : '+'}</span></button>
    </fieldset>
    <p id={`${id}-feedback`} className={`${s.feedback} ${message ? success ? s.success : s.error : ''}`} role="status">{message || `El saldo inicial se cargará directamente en la cuenta.`}</p>
  </>;
}
