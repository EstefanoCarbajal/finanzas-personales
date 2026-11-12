'use client';

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
      retained: income > BigInt(0) ? Number((income - expense) * BigInt(100) / income) : null,
      hasActivity: income > BigInt(0) || expense > BigInt(0), positive: income >= expense,
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
        <span className={s.heroLabel}><i /> TU PANORAMA FINANCIERO</span>
        <h2 id="balance-title">{demo ? 'Saldo del ejemplo' : 'Tu saldo total'}</h2>
        <strong className={s.heroAmount}>{soles(balance)}</strong>
        <p>Todo tu dinero, en un solo lugar.<br />Saldo acumulado entre tus cuentas.</p>
        {demo ? <button className={s.cta} onClick={onRegister}><span aria-hidden="true">＋</span> Registrar movimiento</button> : <a className={s.cta} href="/privado?seccion=movimientos"><span aria-hidden="true">＋</span> Registrar movimiento</a>}
      </div>
      <div className={s.orbit} aria-hidden="true"><div className={s.orbitInner} /><span className={s.spark}>✦</span><div className={s.koala}><img src="/koala.svg" alt="" /></div><span className={s.orbitNote}>Pequeños pasos.<br /><b>Grandes posibilidades.</b></span><span className={s.orbitPlus}>＋</span></div>
      <span className={s.heroCorner}>PEN · SOL PERUANO</span>
    </section>
    <section aria-labelledby="month-title">
      <div className={s.sectionHeading}><div><span className={s.kicker}>EL PRESENTE, MÁS CLARO</span><h2 id="month-title">Tu mes, en equilibrio.</h2></div><div className={s.monthControl}><button aria-label="Ver mes anterior" onClick={() => setMonth(value => shiftMonth(value, -1))}>‹</button><span aria-live="polite">{monthName(month)}</span><button aria-label="Ver mes siguiente" disabled={month >= currentMonth} onClick={() => setMonth(value => shiftMonth(value, 1))}>›</button></div></div>
      <div className={s.metrics}>
        <article className={s.metric}><div className={s.metricLabel}><span className={s.inIcon} aria-hidden="true">↙</span>Ingresos del mes</div><strong>{soles(totals.income)}</strong><div className={s.bar}><i style={{ width: `${totals.incomeShare}%` }} /></div><small>El dinero que llegó a ti</small></article>
        <article className={s.metric}><div className={s.metricLabel}><span className={s.outIcon} aria-hidden="true">↗</span>Gastos del mes</div><strong>{soles(totals.expense)}</strong><div className={`${s.bar} ${s.expenseBar}`}><i style={{ width: `${totals.expenseShare}%` }} /></div><small>Lo que destinaste a tu día a día</small></article>
        <article className={`${s.metric} ${s.net} ${!totals.positive ? s.negative : ''}`}><div className={s.metricLabel}><span aria-hidden="true">✧</span>Balance del mes</div><strong>{soles(totals.net)}</strong><small>{!totals.hasActivity ? 'Tu siguiente paso: registrar un movimiento.' : totals.retained === null ? 'Este mes todavía no registra ingresos.' : totals.positive ? `${totals.retained}% de tus ingresos sigue contigo.` : 'Tus gastos superan tus ingresos este mes.'}</small><span className={s.netDecoration} aria-hidden="true">↗</span></article>
      </div>
    </section>
    <div className={s.details}>
      <section className={s.card} aria-labelledby="expenses-title"><div className={s.cardHeading}><div><span className={s.kicker}>CADA SOL TIENE UNA HISTORIA</span><h2 id="expenses-title">¿A dónde va tu dinero?</h2></div><span className={s.cardIcon} aria-hidden="true">◔</span></div>
        {totals.categories.length ? <><div className={s.chartArea}><div className={s.donut} style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={`Gastos del mes: ${soles(totals.expense)}. Distribución detallada a continuación.`}><div><span>Total gastado</span><strong>{soles(totals.expense)}</strong><small>{totals.categories.length} categorías</small></div></div></div><ul className={s.legend}>{totals.categories.map((item, index) => <li key={item.name}><span className={s.categoryName}><i style={{ background: colors[index] }} />{item.name}</span><strong>{soles(item.amount)}</strong><span>{item.share.toLocaleString('es-PE', { maximumFractionDigits: 1 })}%</span></li>)}</ul></> : <div className={s.empty}><span aria-hidden="true">◌</span><h3>Un mes por escribir</h3><p>Cuando registres un gasto, aquí verás cómo se distribuye tu dinero.</p></div>}
      </section>
      <section className={s.card} aria-labelledby="recent-title"><div className={s.cardHeading}><div><span className={s.kicker}>LOS PEQUEÑOS DETALLES</span><h2 id="recent-title">Tu actividad reciente</h2></div>{demo ? <button className={s.textLink} onClick={onViewMovements}>Ver todos ↗</button> : <a className={s.textLink} href="/privado?seccion=movimientos">Ver todos ↗</a>}</div>
        {totals.recent.length ? <ul className={s.activity}>{totals.recent.map(item => <li key={item.id}><span className={`${s.activityIcon} ${item.kind === 'income' ? s.inIcon : item.kind === 'transfer' ? s.transferIcon : s.outIcon}`} aria-hidden="true">{item.kind === 'income' ? '↙' : item.kind === 'transfer' ? '↔' : '↗'}</span><div><strong>{item.description}</strong><small>{item.kind === 'transfer' ? 'Transferencia' : item.category_name || (item.kind === 'income' ? 'Ingreso' : 'Gasto')} · {new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${item.occurred_on}T00:00:00Z`))}</small></div><b className={item.kind === 'income' ? s.incomeAmount : ''}>{item.kind === 'income' ? '+' : item.kind === 'expense' ? '−' : ''}{soles(item.amount)}</b></li>)}</ul> : <div className={s.empty}><span aria-hidden="true">↔</span><h3>Todo empieza con un paso</h3><p>No hay movimientos en este mes. Usa «Registrar movimiento» para empezar.</p></div>}
        <div className={s.insight}><span aria-hidden="true">✦</span><div><strong>{totals.hasActivity ? 'La claridad también es progreso.' : 'A tu ritmo, desde el principio.'}</strong><p>{totals.hasActivity ? `${totals.count} movimientos en este mes. Conocer tus números te ayuda a decidir tu próximo paso.` : 'No necesitas tenerlo todo resuelto. Empieza por registrar lo que entra y lo que sale.'}</p></div></div>
      </section>
    </div>
    <p className={s.footnote}>Importes en soles · Las transferencias no cuentan como ingresos ni gastos.</p>
  </div>;
}
