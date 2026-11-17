'use client';

import PlanningWorkspace, { type PlanningBudget, type PlanningCategory, type PlanningPayment } from '@/components/planning-workspace';
import PlanningForm from '@/components/planning-form';
import { addBudget, addScheduledPayment, cancelScheduledPayment, markPaymentPaid } from './actions';

const emptyState = { message: '', success: false };
export default function PlanningPanel({ accounts, categories, budgets, payments, month, today }: {
  accounts: { id: string; name: string; currency?: string }[]; categories: PlanningCategory[]; budgets: PlanningBudget[]; payments: PlanningPayment[]; month: string; today: string;
}) {
  return <PlanningWorkspace budgets={budgets} payments={payments} categories={categories} month={month} today={today}
    budgetForm={<PlanningForm kind="budget" categories={categories} month={month} today={today} save={form => addBudget(emptyState, form)} />}
    paymentForm={<PlanningForm kind="payment" categories={categories} accounts={accounts} month={month} today={today} save={form => addScheduledPayment(emptyState, form)} />}
    processPayment={async (id, mode) => {
      const form = new FormData();
      form.set('id', id);
      return mode === 'paid' ? markPaymentPaid(form) : cancelScheduledPayment(form);
    }} />;
}
