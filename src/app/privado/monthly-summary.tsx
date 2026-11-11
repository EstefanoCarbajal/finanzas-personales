'use client';

import { useMemo, useState } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import type { PrivateMovement } from './movements-table';

function shiftMonth(value: string, delta: number) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthName(value: string) {
  const date = new Date(`${value}-01T00:00:00Z`);
  const name = new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  return name.charAt(0).toLocaleUpperCase('es-PE') + name.slice(1);
}

export default function MonthlySummary({ movements, currentMonth }: { movements: PrivateMovement[]; currentMonth: string }) {
  const [month, setMonth] = useState(currentMonth);
  const totals = useMemo(() => {
    let income = BigInt(0);
    let expense = BigInt(0);
    for (const movement of movements) {
      if (movement.occurred_on.slice(0, 7) !== month) continue;
      const amount = toCents(movement.amount);
      if (movement.kind === 'income') income += amount;
      else if (movement.kind === 'expense') expense += amount;
    }
    return { income: decimal(income), expense: decimal(expense), balance: decimal(income - expense) };
  }, [movements, month]);

  return <section className="panel month-summary" aria-labelledby="month-title">
    <div className="panel-heading"><div><h2 id="month-title">Resumen del mes</h2><p aria-live="polite">{monthName(month)}</p></div><div className="month-controls"><button type="button" className="month-arrow" aria-label="Ver mes anterior" onClick={() => setMonth(value => shiftMonth(value, -1))}>←</button><button type="button" className="month-arrow" aria-label="Ver mes siguiente" disabled={month >= currentMonth} onClick={() => setMonth(value => shiftMonth(value, 1))}>→</button><span className="private-panel-icon" aria-hidden="true">☀</span></div></div>
    <div className="month-summary-values"><div><span>Ingresos</span><strong>{soles(totals.income)}</strong></div><div><span>Gastos</span><strong>{soles(totals.expense)}</strong></div><div><span>Balance del mes</span><strong>{soles(totals.balance)}</strong></div></div>
    <p className="panel-foot">Las transferencias entre cuentas no cuentan como ingresos ni gastos.</p>
  </section>;
}
