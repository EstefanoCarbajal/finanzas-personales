'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { soles, decimal, toCents } from '@/lib/money.mjs';
import s from '@/components/movements.module.css';

export type PrivateMovement = { id: string; kind: string; description: string; occurred_on: string; amount: string; account_name: string; destination_name: string | null; category_name: string | null };
const kinds: Record<string, string> = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' };
const icons: Record<string, string> = { income: '↙', expense: '↗', transfer: '↔' };
const dateName = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-PE', { ...options, timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const safeCell = (value: string) => `"${(/^[=+@\-\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;

export default function MovementsTable({ movements, demo = false }: { movements: PrivateMovement[]; demo?: boolean }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [month, setMonth] = useState('all');
  const months = useMemo(() => [...new Set(movements.map(m => m.occurred_on.slice(0, 7)))].sort().reverse(), [movements]);
  const filtered = useMemo(() => movements.filter(m => {
    const text = `${m.description} ${m.account_name} ${m.destination_name || ''} ${m.category_name || ''}`.toLocaleLowerCase('es-PE');
    return text.includes(query.trim().toLocaleLowerCase('es-PE')) && (kind === 'all' || kind === m.kind) && (month === 'all' || m.occurred_on.startsWith(month));
  }).sort((a, b) => b.occurred_on.localeCompare(a.occurred_on)), [movements, query, kind, month]);
  const rowOrder = new Map(filtered.map((movement, index) => [movement.id, index]));
  const groups = new Map<string, PrivateMovement[]>();
  for (const movement of filtered) { const group = groups.get(movement.occurred_on) || []; group.push(movement); groups.set(movement.occurred_on, group); }
  const net = filtered.reduce((sum, m) => sum + (m.kind === 'income' ? toCents(m.amount) : m.kind === 'expense' ? -toCents(m.amount) : BigInt(0)), BigInt(0));
  const hasFilters = !!query || kind !== 'all' || month !== 'all';
  function resetFilters() { setQuery(''); setKind('all'); setMonth('all'); }
  function exportCsv() {
    const rows = [['Fecha', 'Descripción', 'Cuenta', 'Categoría o destino', 'Tipo', 'Importe PEN'], ...filtered.map(m => [m.occurred_on, m.description, m.account_name, m.destination_name || m.category_name || '', kinds[m.kind] || m.kind, m.amount])];
    const csv = rows.map(row => row.map(safeCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = demo ? 'movimientos-demo.csv' : 'mis-movimientos.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className={s.ledger} aria-labelledby="ledger-title">
    <div className={s.ledgerHeading}><div><h2 id="ledger-title">Historial</h2></div><button className={s.export} onClick={exportCsv} disabled={!filtered.length} aria-label="Exportar CSV con los filtros actuales">↓ <span>Exportar CSV</span></button></div>
    <div className={s.filters}><label className={s.search}><span className={s.srOnly}>Buscar movimientos</span><div><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Descripción, cuenta o categoría" /></div></label><label><span className={s.srOnly}>Mes</span><select value={month} onChange={event => setMonth(event.target.value)}><option value="all">Todos los meses</option>{months.map(value => <option key={value} value={value}>{dateName(`${value}-01`, { month: 'long', year: 'numeric' })}</option>)}</select></label></div>
    <div className={s.typeFilters} role="group" aria-label="Filtrar por tipo de movimiento">{[['all', 'Todos'], ['income', 'Ingresos'], ['expense', 'Gastos'], ['transfer', 'Transferencias']].map(([value, label]) => <button key={value} aria-pressed={kind === value} className={kind === value ? s.activeFilter : ''} onClick={() => setKind(value)}>{value !== 'all' && <span aria-hidden="true">{icons[value]}</span>}{label}</button>)}</div>
    <div className={s.results}><span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'movimiento' : 'movimientos'}{hasFilters ? (filtered.length === 1 ? ' encontrado' : ' encontrados') : ''}</span>{hasFilters && <button onClick={resetFilters}>Limpiar filtros ×</button>}</div>
    <div className={s.groups}>{[...groups].map(([date, items]) => <section className={s.dateGroup} key={date} aria-label={dateName(date, { dateStyle: 'full' })}><div className={s.dateHeading}><h3>{dateName(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3><span>{items.length} {items.length === 1 ? 'movimiento' : 'movimientos'}</span></div><ul>{items.map(m => <li key={m.id} className={s.movementRow} style={{ "--row-delay": `${Math.min(rowOrder.get(m.id) ?? 0, 7) * 35}ms` } as CSSProperties}><span className={`${s.movementIcon} ${s[m.kind]}`} aria-hidden="true">{icons[m.kind]}</span><div className={s.movementCopy}><strong>{m.description}</strong><span>{m.account_name}{m.kind === 'transfer' ? ` → ${m.destination_name || 'Cuenta de destino'}` : ` · ${m.category_name || kinds[m.kind]}`}</span><small className={`${s.typeBadge} ${s[m.kind]}`}>{kinds[m.kind]}</small></div><strong className={`${s.movementAmount} ${m.kind === 'income' ? s.incomeAmount : m.kind === 'expense' ? s.expenseAmount : s.transferAmount}`}>{m.kind === 'income' ? '+' : m.kind === 'expense' ? '−' : ''}{soles(m.amount)}</strong></li>)}</ul></section>)}</div>
    {!filtered.length && <div className={s.empty}><span aria-hidden="true">{movements.length ? '⌕' : '↔'}</span><h3>{movements.length ? 'Sin resultados' : 'Aún no hay movimientos'}</h3><p>{movements.length ? 'Prueba otra búsqueda o limpia los filtros.' : 'Tu primer registro aparecerá aquí.'}</p>{hasFilters ? <button className={s.export} onClick={resetFilters}>Ver todos los movimientos</button> : <a href="#movement-entry">Registrar movimiento ↗</a>}</div>}
    {!!filtered.length && <div className={s.filteredBalance}><div><span>Balance de selección</span><small>Ingresos menos gastos · Transferencias excluidas</small></div><strong>{soles(decimal(net))}</strong></div>}
  </section>;
}
