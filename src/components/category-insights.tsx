'use client';

import { useState } from 'react';
import type { PrivateMovement } from '@/app/privado/movements-table';
import type { CategoryItem } from './categories-section';
import palette from './category-color.module.css';
import { categoryColorsFor, expenseGradient, neutralCategoryColor, categoryInsights, ratioPercent } from '@/lib/category-insights.mjs';
import { decimal, soles } from '@/lib/money.mjs';
import s from './category-insights.module.css';

const format = (amount: bigint, currency: string) => currency === 'USD' ? `$ ${BigInt(decimal(amount).split('.')[0]).toLocaleString('es-PE')}.${decimal(amount).split('.')[1]}` : soles(decimal(amount));
const monthLabel = (month: string) => new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`));

export default function CategoryInsights({ movements, categories, currentMonth }: { categories: CategoryItem[]; movements: PrivateMovement[]; currentMonth: string }) {
  return <><CategoryChart movements={movements} categories={categories} currentMonth={currentMonth} kind="expense" /><CategoryChart movements={movements} categories={categories} currentMonth={currentMonth} kind="income" /></>;
}

function CategoryChart({ movements, categories, currentMonth, kind }: { categories: CategoryItem[]; movements: PrivateMovement[]; currentMonth: string; kind: 'expense' | 'income' }) {
  const [month, setMonth] = useState(currentMonth);
  const [currency, setCurrency] = useState('PEN');
  const data = categoryInsights(movements, month, currency, kind);
  const colors = categoryColorsFor(categories, kind);
  const groups = data.groups.map(group => ({
    ...group, color: colors.get(group.key) ?? neutralCategoryColor, share: ratioPercent(group.amount, data.total),
  }));
  const gradient = expenseGradient(groups);
  const title = kind === 'income' ? 'Ingresos' : 'Gastos';
  const titleId = `insights-${kind}-title`;
  return <section className={`${s.dashboard} ${palette.scope}`} aria-labelledby={titleId}>
    <header className={s.header}><h2 id={titleId}>{title} por categoría</h2><div className={s.filters}><label><input aria-label={`Mes de ${title.toLowerCase()}`} type="month" value={month} min="0002-01" max={currentMonth} onChange={event => { if (event.target.value && event.target.validity.valid) setMonth(event.target.value); }} /></label><div className={s.currency} role="group" aria-label={`Moneda de los ${title.toLowerCase()}`}>{['PEN', 'USD'].map(item => <button type="button" key={item} aria-pressed={currency === item} onClick={() => setCurrency(item)}>{item}</button>)}</div></div></header>
    {data.total === BigInt(0) ? <div className={s.empty}><span aria-hidden="true">✳</span><div><strong>Sin {title.toLowerCase()} este mes</strong><p>{monthLabel(month)} · {currency}</p></div></div> : <>
      <div className={s.charts}><div className={s.distribution}><div className={s.chartTitle}><div><h3>Distribución</h3></div><span aria-hidden="true">✳</span></div><div className={s.donutLayout}><div className={s.donut} style={{ background: `conic-gradient(${gradient})` }} aria-hidden="true"></div><div className={s.legend}>{groups.slice(0, 5).map((group) => <div key={group.key}><i style={{ background: group.color }} /><span>{group.name}</span><strong>{group.share.toLocaleString('es-PE')} %</strong></div>)}{data.groups.length > 5 && <small>+{data.groups.length - 5} en el ranking</small>}</div></div></div>
      <div className={s.ranking}><div className={s.chartTitle}><div><h3>Ranking</h3></div><span aria-hidden="true">↗</span></div><ol>{groups.map((group, index) => <li key={group.key}><div className={s.row}><span className={s.rank}>{String(index + 1).padStart(2, '0')}</span><strong>{group.name}</strong><b>{format(group.amount, currency)}</b></div><div className={s.track} aria-hidden="true"><span style={{ width: `${group.share}%`, background: group.color }} /></div></li>)}</ol></div></div>
    </>}
  </section>;
}
