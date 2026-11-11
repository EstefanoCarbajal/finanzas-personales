'use client';

import { useMemo, useState } from 'react';
import { soles } from '@/lib/money.mjs';

export type PrivateMovement = {
  id: string; kind: string; description: string; occurred_on: string; amount: string;
  account_name: string; destination_name: string | null; category_name: string | null;
};

const kinds: Record<string, string> = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' };
const safeCell = (value: string) => {
  const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
};

export default function MovementsTable({ movements }: { movements: PrivateMovement[] }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [month, setMonth] = useState('all');
  const months = useMemo(() => [...new Set(movements.map(m => m.occurred_on.slice(0, 7)))].sort().reverse(), [movements]);
  const filtered = useMemo(() => movements.filter(m => {
    const text = `${m.description} ${m.account_name} ${m.destination_name || ''} ${m.category_name || ''}`.toLocaleLowerCase('es-PE');
    return text.includes(query.trim().toLocaleLowerCase('es-PE')) && (kind === 'all' || kind === m.kind) && (month === 'all' || m.occurred_on.startsWith(month));
  }), [movements, query, kind, month]);

  function exportCsv() {
    const rows = [['Fecha', 'Descripción', 'Cuenta', 'Categoría o destino', 'Tipo', 'Importe PEN'], ...filtered.map(m => [
      m.occurred_on, m.description, m.account_name, m.destination_name || m.category_name || '', kinds[m.kind] || m.kind, m.amount,
    ])];
    const csv = rows.map(row => row.map(safeCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'mis-movimientos.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <>
    <div className="movement-tools"><label className="search">Buscar movimientos<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Descripción, cuenta o categoría" /></label><label>Mes<select value={month} onChange={event => setMonth(event.target.value)}><option value="all">Todos los meses</option>{months.map(value => <option key={value} value={value}>{new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T00:00:00Z`))}</option>)}</select></label><label className="kind-filter">Tipo<select value={kind} onChange={event => setKind(event.target.value)}><option value="all">Todos</option><option value="income">Ingresos</option><option value="expense">Gastos</option><option value="transfer">Transferencias</option></select></label><button className="secondary export-button" onClick={exportCsv}>Exportar CSV ↓</button></div>
    <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Descripción</th><th>Cuenta</th><th>Categoría / destino</th><th>Tipo</th><th className="amount">Importe</th></tr></thead><tbody>{filtered.map(m => <tr key={m.id}><td>{m.occurred_on.split('-').reverse().join('/')}</td><td><strong>{m.description}</strong></td><td>{m.account_name}</td><td>{m.kind === 'transfer' ? m.destination_name : m.category_name}</td><td><span className={`category-tag movement-tag ${m.kind}`}>{kinds[m.kind]}</span></td><td className={`amount ${m.kind === 'income' ? 'positive' : ''}`}>{soles(m.amount)}</td></tr>)}</tbody></table>{!filtered.length && <p className="empty">{movements.length ? 'No encontramos movimientos con esos filtros.' : 'Aún no hay movimientos. Cuando registres el primero, aparecerá aquí.'}</p>}</div>
    <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'movimiento' : 'movimientos'}</p>
  </>;
}
