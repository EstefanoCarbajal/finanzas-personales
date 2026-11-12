import s from './accounts.module.css';

export default function AccountSetupFields({ category = false, name, onNameChange, kind, onKindChange, pending = false, message = '', success = false }: {
  category?: boolean; name: string; onNameChange: (name: string) => void; kind?: string; onKindChange?: (kind: string) => void;
  pending?: boolean; message?: string; success?: boolean;
}) {
  const id = category ? 'new-category' : 'new-account';
  return <>
    <fieldset className={s.formFields} disabled={pending}>
      <label htmlFor={id}>Nombre<input id={id} name="name" aria-label={`Nombre de la ${category ? 'categoría' : 'cuenta'}`} required maxLength={80} value={name} onChange={event => onNameChange(event.target.value)} placeholder={category ? 'Ej. Mascotas' : 'Ej. Cuenta sueldo'} aria-describedby={`${id}-feedback`} /></label>
      {category && <label htmlFor="new-category-kind">Tipo<select id="new-category-kind" name="kind" aria-label="Tipo de categoría" value={kind} onChange={event => onKindChange?.(event.target.value)}><option value="expense">Gasto</option><option value="income">Ingreso</option></select></label>}
      <button type="submit" className={s.submit}>{pending ? 'Guardando…' : 'Crear'}<span aria-hidden="true">{pending ? '…' : '+'}</span></button>
    </fieldset>
    <p id={`${id}-feedback`} className={`${s.feedback} ${message ? success ? s.success : s.error : ''}`} role="status">{message || (category ? '' : 'Saldo inicial: S/ 0.00.')}</p>
  </>;
}
