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
    const categories = new Map<string, bigint>();
    for (const movement of movements) {
      if (movement.occurred_on.slice(0, 7) !== month) continue;
      const amount = toCents(movement.amount);
      if (movement.kind === 'income') income += amount;
      else if (movement.kind === 'expense') { expense += amount; const name = movement.category_name || 'Otros'; categories.set(name, (categories.get(name) || BigInt(0)) + amount); }
    }
    const scale = income > expense ? income : expense;
    return { income: decimal(income), expense: decimal(expense), balance: decimal(income - expense), incomeShare: scale ? Number(income * BigInt(100) / scale) : 0, expenseShare: scale ? Number(expense * BigInt(100) / scale) : 0, hasActivity: income > BigInt(0) || expense > BigInt(0), positive: income >= expense, categories: [...categories].map(([name, amount]) => ({ name, amount: decimal(amount), share: expense ? Number(amount * BigInt(100) / expense) : 0 })).sort((a, b) => Number(b.amount) - Number(a.amount)) };
  }, [movements, month]);

  return <section className="panel month-summary" aria-labelledby="month-title">
    <div className="panel-heading"><div><h2 id="month-title">Resumen del mes</h2><p aria-live="polite">{monthName(month)}</p></div><div className="month-controls"><button type="button" className="month-arrow" aria-label="Ver mes anterior" onClick={() => setMonth(value => shiftMonth(value, -1))}>←</button><button type="button" className="month-arrow" aria-label="Ver mes siguiente" disabled={month >= currentMonth} onClick={() => setMonth(value => shiftMonth(value, 1))}>→</button><span className="private-panel-icon" aria-hidden="true">☀</span></div></div>
    <div className="month-summary-values">
      <div className="month-value income-value"><span><i aria-hidden="true">↘</i>Ingresos</span><strong>{soles(totals.income)}</strong><div className="month-track"><i style={{ width: `${totals.incomeShare}%` }} /></div></div>
      <div className="month-value expense-value"><span><i aria-hidden="true">↗</i>Gastos</span><strong>{soles(totals.expense)}</strong><div className="month-track"><i style={{ width: `${totals.expenseShare}%` }} /></div></div>
      <div className="month-balance"><span>Disponible este mes</span><strong>{soles(totals.balance)}</strong><small>{totals.hasActivity ? (totals.positive ? 'Vas paso a paso, ¡buen trabajo!' : 'Tus gastos superan tus ingresos este mes.') : 'Aquí aparecerá tu balance cuando registres movimientos.'}</small></div>
    </div>
    <div className="private-category-chart"><div className="private-chart-heading"><div><h3>¿En qué estás gastando?</h3><p>Distribución por categoría</p></div><span>Este mes</span></div>{totals.categories.length ? totals.categories.slice(0, 5).map((item, index) => <div className="private-category-row" key={item.name}><div><span><i className={`category-dot dot-${index % 4}`} />{item.name}</span><strong>{soles(item.amount)}</strong></div><div className="private-category-track"><i className={`category-fill fill-${index % 4}`} style={{ width: `${Math.max(item.share, 2)}%` }} /></div></div>) : <p className="empty">Aún no hay gastos en este mes.</p>}</div>
    <p className="panel-foot">La claridad empieza por saber dónde estás. Las transferencias no cuentan como ingresos ni gastos.</p>
  </section>;
}
