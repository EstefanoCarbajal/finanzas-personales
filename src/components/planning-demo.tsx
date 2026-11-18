'use client';

import type { ReactNode } from 'react';

import { decimal, toCents } from '@/lib/money.mjs';
import PlanningWorkspace, { type PlanningCategory } from './planning-workspace';
import PlanningForm from './planning-form';

export default function PlanningDemo({ categories, accounts, movements, section = 'planificacion', goals }: {
  categories: PlanningCategory[]; accounts: { id: string; name: string }[];
  movements: { kind: string; amount: string; category_id: string | null; occurred_on: string }[];
  section?: 'planificacion' | 'pagos'; goals?: ReactNode;
}) {
  const month = '2026-11', today = '2026-11-11';
  const budgets = [{ id: 'expense-0', name: 'Alimentación', amount: '800.00' }, { id: 'expense-1', name: 'Transporte', amount: '250.00' }, { id: 'expense-3', name: 'Ocio', amount: '200.00' }].map(item => ({
    id: item.id, category_id: item.id, category_name: categories.find(c => c.id === item.id)?.name || item.name, amount: item.amount,
    spent: decimal(movements.filter(m => m.kind === 'expense' && m.category_id === item.id && m.occurred_on.startsWith(month)).reduce((sum, m) => sum + toCents(m.amount), BigInt(0))),
  }));
  const payments = [{ id: 'internet', automatic_at: '2026-11-15 14:00:00', automatic_time: '09:00', description: 'Internet de casa', amount: '99.00', due_on: '2026-11-15', account_name: 'Cuenta de ejemplo', category_name: 'Servicios' }, { id: 'music', description: 'Suscripción de música', amount: '20.90', due_on: '2026-11-20', account_name: 'Cuenta de ejemplo', category_name: 'Ocio' }];
  return <PlanningWorkspace key={section} section={section} goals={goals} demo budgets={budgets} payments={payments} categories={categories} month={month} today={today}
    budgetForm={<PlanningForm kind="budget" categories={categories} month={month} today={today} />}
    paymentForm={<PlanningForm kind="payment" categories={categories} accounts={accounts} month={month} today={today} />} />;
}
