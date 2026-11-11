'use client';

import { useActionState } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import { addBudget, addScheduledPayment, cancelScheduledPayment, markPaymentPaid } from './actions';

type Named = { id: string; name: string };
type Budget = { id: string; category_id: string; category_name: string; month_start: string; amount: string; spent: string };
type Payment = { id: string; description: string; amount: string; due_on: string; account_name: string; category_name: string };
const emptyState = { message: '', success: false };
const moneyDiff = (left: string, right: string) => decimal(toCents(left) - toCents(right));
const formatDate = (value: string) => new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

export default function PlanningPanel({ accounts, categories, budgets, payments, month, today }: {
  accounts: Named[]; categories: (Named & { kind: string })[]; budgets: Budget[]; payments: Payment[]; month: string; today: string;
}) {
  const [budgetState, budgetAction, budgetPending] = useActionState(addBudget, emptyState);
  const [paymentState, paymentAction, paymentPending] = useActionState(addScheduledPayment, emptyState);
  const expenseCategories = categories.filter(category => category.kind === 'expense');

  return <div className="planning-grid" id="planificacion">
    <section className="panel planning-card"><div className="panel-heading"><div><h2>Presupuestos</h2><p>Define un límite para cada categoría este mes.</p></div><span className="private-panel-icon account-icon" aria-hidden="true">◎</span></div>
      <form action={budgetAction} className="planning-form"><input type="hidden" name="month" value={month} /><label>Categoría de gasto<select name="category_id" required disabled={!expenseCategories.length}>{expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="form-row"><label>Presupuesto (S/)<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" placeholder="0.00" required /></label><button className="primary" disabled={budgetPending || !expenseCategories.length}>{budgetPending ? 'Guardando…' : 'Guardar límite'}</button></div><p className={budgetState.success ? 'planning-message success' : 'planning-message'} role="status">{budgetState.message || 'Al guardar otra vez una categoría, se actualiza su límite.'}</p></form>
      <div className="planning-list">{budgets.map(budget => {
        const limit = toCents(budget.amount), spent = toCents(budget.spent);
        const percent = Number(spent * BigInt(100) / limit);
        const progress = Math.min(100, Math.max(0, percent));
        return <div className="budget-item" key={budget.id}><div className="budget-line"><strong>{budget.category_name}</strong><span>{soles(budget.spent)} / {soles(budget.amount)}</span></div><progress aria-label={`Presupuesto de ${budget.category_name}`} value={progress} max={100} /><small>{spent > limit ? `Exceso: ${soles(moneyDiff(budget.spent, budget.amount))}` : `Disponible: ${soles(moneyDiff(budget.amount, budget.spent))}`}</small></div>;
      })}{!budgets.length && <p className="empty planning-empty">Aún no tienes límites para este mes.</p>}</div>
    </section>

    <section className="panel planning-card"><div className="panel-heading"><div><h2>Pagos futuros</h2><p>Planifica vencimientos sin descontarlos todavía.</p></div><span className="private-panel-icon movement-icon" aria-hidden="true">◷</span></div>
      <form action={paymentAction} className="planning-form"><label>Descripción<input name="description" maxLength={100} required placeholder="Ej. Internet de casa" /></label><div className="form-row"><label>Importe (S/)<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" placeholder="0.00" required /></label><label>Vence el<input name="due_on" type="date" min={today} defaultValue={today} required /></label></div><div className="form-row"><label>Cuenta<select name="account_id" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label><label>Categoría<select name="category_id" required>{expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><button className="primary" disabled={paymentPending || !accounts.length || !expenseCategories.length}>{paymentPending ? 'Guardando…' : 'Añadir pago previsto'}</button><p className={paymentState.success ? 'planning-message success' : 'planning-message'} role="status">{paymentState.message || 'Solo al marcarlo como pagado se registrará como gasto.'}</p></form>
      <div className="planning-list">{payments.map(payment => <article className="scheduled-payment" key={payment.id}><div className="payment-info"><span className="date-tile"><small>{formatDate(payment.due_on).split(' ')[1]?.replace('.', '').toUpperCase() || 'FECHA'}</small>{formatDate(payment.due_on).split(' ')[0]}</span><div><strong>{payment.description}</strong><small>{payment.category_name} · {payment.account_name}</small></div><b>{soles(payment.amount)}</b></div><div className="payment-actions"><form action={markPaymentPaid}><input type="hidden" name="id" value={payment.id} /><button className="payment-confirm">Marcar pagado</button></form><form action={cancelScheduledPayment}><input type="hidden" name="id" value={payment.id} /><button className="payment-cancel">Cancelar</button></form></div></article>)}{!payments.length && <p className="empty planning-empty">No hay pagos futuros pendientes.</p>}</div>
    </section>
  </div>;
}
