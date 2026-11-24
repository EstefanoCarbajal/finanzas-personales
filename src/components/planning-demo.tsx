'use client';

import { useState, type ReactNode } from 'react';

import { decimal, toCents } from '@/lib/money.mjs';
import { validatePaymentEdit } from '@/lib/payment-edit-policy.mjs';
import PlanningWorkspace, { type PlanningPayment, type PlanningCategory } from './planning-workspace';
import PlanningForm from './planning-form';

export default function PlanningDemo({ categories, accounts, movements, section = 'planificacion', goals }: {
  categories: PlanningCategory[]; accounts: { id: string; name: string; currency?: string; account_type?: string }[];
  movements: { kind: string; amount: string; category_id: string | null; occurred_on: string }[];
  section?: 'planificacion' | 'pagos'; goals?: ReactNode;
}) {
  const [paymentChanges, setPaymentChanges] = useState<Record<string, PlanningPayment | null>>({});
  const [changes, setChanges] = useState<Record<string, string | null>>({});
  const month = '2026-11', today = '2026-11-11';
  const budgets = [{ id: 'expense-0', name: 'Alimentación', amount: '800.00' }, { id: 'expense-1', name: 'Transporte', amount: '250.00' }, { id: 'expense-3', name: 'Ocio', amount: '200.00' }].map(item => ({
    id: item.id, category_id: item.id, category_name: categories.find(c => c.id === item.id)?.name || item.name, amount: changes[item.id] ?? item.amount,
    spent: decimal(movements.filter(m => m.kind === 'expense' && m.category_id === item.id && m.occurred_on.startsWith(month)).reduce((sum, m) => sum + toCents(m.amount), BigInt(0))),
  })).filter(item => changes[item.id] !== null);
  const basePayments = [{ id: 'internet', automatic_at: '2026-11-15 14:00:00', automatic_time: '09:00', description: 'Internet de casa', amount: '99.00', due_on: '2026-11-15', account_name: 'Cuenta de ejemplo', category_name: 'Servicios' }, { id: 'music', description: 'Suscripción de música', amount: '20.90', due_on: '2026-11-20', account_name: 'Cuenta de ejemplo', category_name: 'Ocio' }];
  const payments: PlanningPayment[] = basePayments.map(payment => paymentChanges[payment.id] || { ...payment, account_id: accounts[0]?.id || '', category_id: categories.find(category => category.kind === 'expense' && category.name === payment.category_name)?.id || categories.find(category => category.kind === 'expense')?.id || '' }).filter(payment => paymentChanges[payment.id] !== null);

  return <PlanningWorkspace key={section} section={section} goals={goals} accounts={accounts} demo managePayment={async (id, mode, input) => {
      const existing = payments.find(payment => payment.id === id);
      if (!existing) return { success: false, message: 'El pago ya no está disponible.' };
      if (mode === 'delete') { setPaymentChanges(current => ({ ...current, [id]: null })); return { success: true, message: 'Pago eliminado en la demo.' }; }
      try {
        const value = validatePaymentEdit(input, today, existing.due_on, new Date('2026-11-11T12:00:00-05:00'));
        const account = accounts.find(account => account.id === input?.account_id);
        const category = categories.find(category => category.id === input?.category_id && category.kind === 'expense');
        if (!account || !category) return { success: false, message: 'Elige una cuenta y categoría válidas.' };
        setPaymentChanges(current => ({ ...current, [id]: { ...existing, ...value, account_id: account.id, account_name: account.name, currency: account.currency || 'PEN', category_id: category.id, category_name: category.name, automatic_time: value.automatic_at ? input?.automatic_time : null } }));
        return { success: true, message: 'Pago actualizado en la demo.' };
      } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa los datos.' }; }
    }} manageBudget={async (id, mode, amount) => {
      if (!budgets.some(budget => budget.id === id)) return { success: false, message: 'El presupuesto ya no está disponible.' };
      if (mode === 'delete') { setChanges(current => ({ ...current, [id]: null })); return { success: true, message: 'Presupuesto eliminado en la demo.' }; }
      try {
        const cents = toCents(amount);
        if (cents <= BigInt(0)) throw new Error();
        setChanges(current => ({ ...current, [id]: decimal(cents) }));
        return { success: true, message: 'Presupuesto actualizado en la demo.' };
      } catch { return { success: false, message: 'Introduce un importe mayor que cero, con hasta dos decimales.' }; }
    }} budgets={budgets} payments={payments} categories={categories} month={month} today={today}
    budgetForm={<PlanningForm kind="budget" categories={categories} month={month} today={today} />}
    paymentForm={<PlanningForm kind="payment" categories={categories} accounts={accounts} month={month} today={today} />} />;
}
