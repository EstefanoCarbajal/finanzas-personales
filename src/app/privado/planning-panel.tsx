'use client';

import type { ReactNode } from 'react';

import PlanningWorkspace, { type PlanningBudget, type PlanningCategory, type PlanningPayment } from '@/components/planning-workspace';
import PlanningForm from '@/components/planning-form';
import { changeFuturePayment, manageBudget, addBudget, addScheduledPayment, cancelScheduledPayment, markPaymentPaid } from './actions';

const emptyState = { message: '', success: false };
export default function PlanningPanel({ accounts, categories, budgets, payments, month, today, section = 'planificacion', goals }: {
  accounts: { id: string; name: string; currency?: string }[]; categories: PlanningCategory[]; budgets: PlanningBudget[]; payments: PlanningPayment[]; month: string; today: string;
  section?: 'planificacion' | 'pagos'; goals?: ReactNode;
}) {
  return <PlanningWorkspace key={section} section={section} goals={goals} accounts={accounts} managePayment={changeFuturePayment} manageBudget={manageBudget} budgets={budgets} payments={payments} categories={categories} month={month} today={today}
    budgetForm={<PlanningForm kind="budget" categories={categories} month={month} today={today} save={form => addBudget(emptyState, form)} />}
    paymentForm={<PlanningForm kind="payment" categories={categories} accounts={accounts} month={month} today={today} save={form => addScheduledPayment(emptyState, form)} />}
    processPayment={async (id, mode) => {
      const form = new FormData();
      form.set('id', id);
      return mode === 'paid' ? markPaymentPaid(form) : cancelScheduledPayment(form);
    }} />;
}
