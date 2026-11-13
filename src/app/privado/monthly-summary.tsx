'use client';

import SelectedAvatar from '@/components/selected-avatar';
import { useMemo, useState } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import type { PrivateMovement } from './movements-table';
import s from './monthly-summary.module.css';

function shiftMonth(value: string, delta: number) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}
const monthName = (value: string) => new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T00:00:00Z`));
const colors = ['#a9dc62', '#8b9bdf', '#f1ba75', '#6cc6b4', '#e79cae', '#a5b6a7'];
type Props = { movements: PrivateMovement[]; currentMonth: string; balance: string; demo?: boolean; onRegister?: () => void; onViewMovements?: () => void };

export default function MonthlySummary({ movements, currentMonth, balance, demo = false, onRegister, onViewMovements }: Props) {
  const [month, setMonth] = useState(currentMonth);
  const totals = useMemo(() => {
    let income = BigInt(0), expense = BigInt(0);
    const categories = new Map<string, bigint>();
    const activity = movements.filter(m => m.occurred_on.slice(0, 7) === month);
    for (const movement of activity) {
      const amount = toCents(movement.amount);
      if (movement.kind === 'income') income += amount;
      else if (movement.kind === 'expense') {
        expense += amount;
        const name = movement.category_name || 'Otros';
        categories.set(name, (categories.get(name) || BigInt(0)) + amount);
      }
    }
    const sorted = [...categories].sort((a, b) => a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0);
    const grouped = sorted.length > 6 ? [...sorted.slice(0, 5), ['Otras categorías', sorted.slice(5).reduce((sum, item) => sum + item[1], BigInt(0))] as [string, bigint]] : sorted;
    const scale = income > expense ? income : expense;
    return {
      income: decimal(income), expense: decimal(expense), net: decimal(income - expense),
      incomeShare: scale ? Number(income * BigInt(10000) / scale) / 100 : 0,
      expenseShare: scale ? Number(expense * BigInt(10000) / scale) / 100 : 0,
      positive: income >= expense,
      categories: grouped.map(([name, amount]) => ({ name, amount: decimal(amount), share: expense ? Number(amount * BigInt(10000) / expense) / 100 : 0 })),
      recent: [...activity].sort((a, b) => b.occurred_on.localeCompare(a.occurred_on)).slice(0, 4), count: activity.length,
    };
  }, [movements, month]);
  let offset = 0;
  const gradient = totals.categories.map((item, index) => {
    const start = offset; offset += item.share;
    return `${colors[index]} ${start}% ${index === totals.categories.length - 1 ? 100 : offset}%`;
  }).join(', ');
  return <div className={s.summary}>
    <section className={s.hero} aria-labelledby="balance-title">
      <div className={s.heroCopy}>
        <h2 id="balance-title">Saldo total</h2>
        <strong className={s.heroAmount}>{soles(balance)}</strong>
        <p>Acumulado en todas tus cuentas</p>
        <button className={s.cta} onClick={onRegister} aria-haspopup="dialog"><span aria-hidden="true">＋</span> Registrar movimiento</button>
      </div>
      <div className={s.orbit} aria-hidden="true"><div className={s.orbitInner} /><span className={s.spark}>✦</span><div className={s.koala}><SelectedAvatar /></div><span className={s.orbitPlus}>＋</span></div>
    </section>
    <section aria-labelledby="month-title">
      <div className={s.sectionHeading}><h2 id="month-title">Resumen mensual</h2><div className={s.monthControl}><button aria-label="Ver mes anterior" onClick={() => setMonth(value => shiftMonth(value, -1))}>‹</button><span aria-live="polite">{monthName(month)}</span><button aria-label="Ver mes siguiente" disabled={month >= currentMonth} onClick={() => setMonth(value => shiftMonth(value, 1))}>›</button></div></div>
      <div className={s.metrics}>
        <article className={s.metric}><div className={s.metricLabel}><span className={s.inIcon} aria-hidden="true">↙</span>Ingresos</div><strong>{soles(totals.income)}</strong><div className={s.bar}><i style={{ width: `${totals.incomeShare}%` }} /></div></article>
        <article className={s.metric}><div className={s.metricLabel}><span className={s.outIcon} aria-hidden="true">↗</span>Gastos</div><strong>{soles(totals.expense)}</strong><div className={`${s.bar} ${s.expenseBar}`}><i style={{ width: `${totals.expenseShare}%` }} /></div></article>
        <article className={`${s.metric} ${s.net} ${!totals.positive ? s.negative : ''}`}><div className={s.metricLabel}><span aria-hidden="true">✧</span>Balance</div><strong>{soles(totals.net)}</strong><small>Ingresos − gastos</small><span className={s.netDecoration} aria-hidden="true">{totals.positive ? '↗' : '↘'}</span></article>
      </div>
    </section>
    <div className={s.details}>
      <section className={s.card} aria-labelledby="expenses-title"><div className={s.cardHeading}><h2 id="expenses-title">Gastos por categoría</h2><span className={s.cardIcon} aria-hidden="true">◔</span></div>
        {totals.categories.length ? <><div className={s.chartArea}><div className={s.donut} style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={`Gastos del mes: ${soles(totals.expense)}. Distribución detallada a continuación.`}><div><span>Total gastado</span><strong>{soles(totals.expense)}</strong></div></div></div><ul className={s.legend}>{totals.categories.map((item, index) => <li key={item.name}><span className={s.categoryName}><i style={{ background: colors[index] }} />{item.name}</span><strong>{soles(item.amount)}</strong><span>{item.share.toLocaleString('es-PE', { maximumFractionDigits: 1 })}%</span></li>)}</ul></> : <div className={s.empty}><span aria-hidden="true">◌</span><h3>Sin gastos este mes</h3></div>}
      </section>
      <section className={s.card} aria-labelledby="recent-title"><div className={s.cardHeading}><h2 id="recent-title">Últimos movimientos</h2>{demo ? <button className={s.textLink} aria-label="Ver todos los movimientos" onClick={onViewMovements}>Ver todos ↗</button> : <a className={s.textLink} aria-label="Ver todos los movimientos" href="/privado?seccion=movimientos">Ver todos ↗</a>}</div>
        {totals.recent.length ? <ul className={s.activity}>{totals.recent.map(item => <li key={item.id}><span className={`${s.activityIcon} ${item.kind === 'income' ? s.inIcon : item.kind === 'transfer' ? s.transferIcon : s.outIcon}`} aria-hidden="true">{item.kind === 'income' ? '↙' : item.kind === 'transfer' ? '↔' : '↗'}</span><div><strong>{item.description}</strong><small>{item.kind === 'transfer' ? 'Transferencia' : item.category_name || (item.kind === 'income' ? 'Ingreso' : 'Gasto')} · {new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${item.occurred_on}T00:00:00Z`))}</small></div><b className={item.kind === 'income' ? s.incomeAmount : ''}>{item.kind === 'income' ? '+' : item.kind === 'expense' ? '−' : ''}{soles(item.amount)}</b></li>)}</ul> : <div className={s.empty}><span aria-hidden="true">↔</span><h3>Sin movimientos este mes</h3><button className={s.textLink} onClick={onRegister} aria-haspopup="dialog">Registrar movimiento ＋</button></div>}
        {totals.count > 0 && <div className={s.insight}><span aria-hidden="true">↔</span><strong>{totals.count} {totals.count === 1 ? 'movimiento en el mes' : 'movimientos en el mes'}</strong></div>}
      </section>
    </div>
    <p className={s.footnote}>Ingresos y gastos no incluyen transferencias.</p>
  </div>;
}
