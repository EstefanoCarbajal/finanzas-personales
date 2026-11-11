'use client';

import { useActionState } from 'react';
import { addAccount, addCategory } from './actions';

const initial = { message: '', success: false };

export default function SetupForms() {
  const [accountState, accountAction, accountPending] = useActionState(addAccount, initial);
  const [categoryState, categoryAction, categoryPending] = useActionState(addCategory, initial);

  return <section className="panel setup-panel" aria-labelledby="setup-title">
    <div className="panel-heading"><div><h2 id="setup-title">Personaliza tu espacio</h2><p>Añade cuentas y categorías para organizar tus movimientos.</p></div><span className="private-panel-icon account-icon" aria-hidden="true">✳</span></div>
    <div className="setup-columns">
      <form action={accountAction} className="setup-form">
        <label htmlFor="new-account">Nueva cuenta</label>
        <div className="setup-control"><input id="new-account" name="name" required maxLength={80} placeholder="Ej. Cuenta sueldo" /><button className="primary" disabled={accountPending}>{accountPending ? 'Guardando…' : 'Añadir'}</button></div>
        <p className={accountState.success ? 'setup-message success' : 'setup-message'} role="status">{accountState.message || 'Crea espacios como efectivo, ahorros o tarjeta.'}</p>
      </form>
      <form action={categoryAction} className="setup-form">
        <label htmlFor="new-category">Nueva categoría</label>
        <div className="setup-control"><input id="new-category" name="name" required maxLength={80} placeholder="Ej. Mascotas" /><select name="kind" aria-label="Tipo de categoría"><option value="expense">Gasto</option><option value="income">Ingreso</option></select><button className="primary" disabled={categoryPending}>{categoryPending ? 'Guardando…' : 'Añadir'}</button></div>
        <p className={categoryState.success ? 'setup-message success' : 'setup-message'} role="status">{categoryState.message || 'Elige si servirá para ingresos o gastos.'}</p>
      </form>
    </div>
  </section>;
}
