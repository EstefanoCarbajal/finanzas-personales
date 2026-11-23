'use client';

import { useState } from 'react';
import type { PrivateMovement } from '@/app/privado/movements-table';
import { categoryInsights, previousMonth, ratioPercent } from '@/lib/category-insights.mjs';
import { decimal, soles } from '@/lib/money.mjs';
import s from './category-insights.module.css';

const colors = ['#b8e76b', '#63c8ab', '#f6b991', '#a998e6', '#ef91a5', '#7db5df', '#e5cf7c', '#98b9a1'];
const format = (amount: bigint, currency: string) => currency === 'USD' ? `$ ${BigInt(decimal(amount).split('.')[0]).toLocaleString('es-PE')}.${decimal(amount).split('.')[1]}` : soles(decimal(amount));
const monthLabel = (month: string) => new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`));

export default function CategoryInsights({ movements, currentMonth }: { movements: PrivateMovement[]; currentMonth: string }) {
  const [month, setMonth] = useState(currentMonth);
  const [currency, setCurrency] = useState('PEN');
  const data = categoryInsights(movements, month, currency);
  const previous = categoryInsights(movements, previousMonth(month), currency);
  const leading = data.groups[0];
  let stop = 0;
  const gradient = data.groups.map((group, index) => { const start = stop; stop += ratioPercent(group.amount, data.total); return `${colors[index % colors.length]} ${start}% ${Math.min(stop, 100)}%`; }).join(', ');
  const change = data.total - previous.total;
  return <section className={s.dashboard} aria-labelledby="insights-title">
    <header className={s.header}><h2 id="insights-title">Gastos por categoría</h2><div className={s.filters}><label>Mes <input type="month" value={month} min="0002-01" max={currentMonth} onChange={event => { if (event.target.value && event.target.validity.valid) setMonth(event.target.value); }} /></label><div className={s.currency} role="group" aria-label="Moneda de los gastos">{['PEN', 'USD'].map(item => <button type="button" key={item} aria-pressed={currency === item} onClick={() => setCurrency(item)}>{item}</button>)}</div></div></header>
    {data.total === BigInt(0) ? <div className={s.empty}><span aria-hidden="true">✳</span><div><strong>Sin gastos este mes</strong><p>{monthLabel(month)} · {currency}</p></div></div> : <>
      <div className={s.metrics}><div className={s.hero}><span>Gasto total</span><strong>{format(data.total, currency)}</strong><small>{data.count} {data.count === 1 ? 'gasto' : 'gastos'}</small><span className={s.sparkle} aria-hidden="true">✳</span></div><div className={s.metric}><span>Mayor gasto</span><strong>{leading.name}</strong><small>{ratioPercent(leading.amount, data.total).toLocaleString('es-PE')} % · {format(leading.amount, currency)}</small></div><div className={s.metric}><span>Respecto al mes anterior</span><strong>{previous.total === BigInt(0) ? 'Sin comparación' : `${change > BigInt(0) ? '+' : change < BigInt(0) ? '−' : ''}${format(change < BigInt(0) ? -change : change, currency)}`}</strong><small>{previous.total === BigInt(0) ? 'Sin gastos el mes anterior' : `Mes anterior: ${format(previous.total, currency)}`}</small></div></div>
      <div className={s.charts}><div className={s.distribution}><div className={s.chartTitle}><div><h3>Distribución</h3></div><span aria-hidden="true">✳</span></div><div className={s.donutLayout}><div className={s.donut} style={{ background: `conic-gradient(${gradient})` }} aria-hidden="true"><div><strong>{data.groups.length}</strong><span>{data.groups.length === 1 ? 'categoría' : 'categorías'}</span></div></div><div className={s.legend}>{data.groups.slice(0, 5).map((group, index) => <div key={group.key}><i style={{ background: colors[index % colors.length] }} /><span>{group.name}</span><strong>{ratioPercent(group.amount, data.total).toLocaleString('es-PE')} %</strong></div>)}{data.groups.length > 5 && <small>+{data.groups.length - 5} en el ranking</small>}</div></div></div>
      <div className={s.ranking}><div className={s.chartTitle}><div><h3>Ranking</h3></div><span aria-hidden="true">↗</span></div><ol>{data.groups.map((group, index) => <li key={group.key}><div className={s.row}><span className={s.rank}>{String(index + 1).padStart(2, '0')}</span><strong>{group.name}</strong><b>{format(group.amount, currency)}</b></div><div className={s.track} aria-hidden="true"><span style={{ width: `${ratioPercent(group.amount, data.total)}%`, background: colors[index % colors.length] }} /></div><small>{ratioPercent(group.amount, data.total).toLocaleString('es-PE')} % · {group.count} {group.count === 1 ? 'gasto' : 'gastos'}</small></li>)}</ol></div></div>
    </>}
  </section>;
}
