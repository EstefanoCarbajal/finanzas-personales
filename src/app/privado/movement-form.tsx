'use client';

import { useActionState, useEffect, useState } from 'react';
import { addMovement } from './actions';

type Account = { id: string; name: string };
type Category = Account & { kind: string };
export default function MovementForm({ accounts, categories, today, requestId }: { accounts: Account[]; categories: Category[]; today: string; requestId: string }) {
  const [kind, setKind] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [id, setId] = useState(requestId);
  const [state, action, pending] = useActionState(addMovement, { message: '', success: false });
  useEffect(() => {
    if (state.success) {
      setId(crypto.randomUUID());
      setDescription('');
      setAmount('');
    }
  }, [state]);
  // React resets action forms even when the action returns a validation error.
  // Keep the current values and selections; clear entry fields only after success.
  return <form action={action} className="private-form" onReset={event => event.preventDefault()}>
    <fieldset disabled={pending}>
    <input type="hidden" name="request_id" value={id} />
    <label>Descripción<input name="description" required maxLength={100} placeholder="Por ejemplo, compra de alimentos" value={description} onChange={event => setDescription(event.target.value)} /></label>
    <div className="form-row"><label>Tipo<select name="kind" value={kind} onChange={e => setKind(e.target.value)}><option value="expense">Gasto</option><option value="income">Ingreso</option><option value="transfer">Transferencia / aporte a ahorros</option></select></label>
    <label>Importe (S/)<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="0.00" maxLength={14} value={amount} onChange={event => setAmount(event.target.value)} /></label></div>
    <div className="form-row"><label>Cuenta de {kind === 'income' ? 'ingreso' : 'origen'}<select name="account_id" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
    {kind === 'transfer' ? <label>Cuenta de destino<select name="destination_id" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
      : <label>Categoría<select key={kind} name="category_id" required>{categories.filter(c => c.kind === kind).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}</div>
    <label>Fecha<input name="occurred_on" type="date" defaultValue={today} min="1900-01-01" max={today} required /></label>
    <p className="subtle">Las transferencias y aportes entre tus cuentas no suman gastos. Los pagos futuros se registrarán en planificación.</p>
    <p role="status">{state.message}</p><button disabled={pending || !accounts.length} className="primary">{pending ? 'Guardando…' : 'Guardar movimiento'}</button>
    </fieldset>
  </form>;
}
