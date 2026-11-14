'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { soles } from '@/lib/money.mjs';
import s from '@/components/movements.module.css';
import d from './movements-dashboard.module.css';
import MovementForm from './movement-form';
import { removeMovement } from './actions';
import type { MovementAccount, MovementCategory } from '@/components/movement-fields';

export type PrivateMovement = { id: string; kind: string; description: string; occurred_on: string; amount: string; account_id: string; destination_id: string | null; category_id?: string | null; account_name: string; destination_name: string | null; category_name: string | null };
const kinds: Record<string, string> = { income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' };
const icons: Record<string, string> = { income: '↙', expense: '↗', transfer: '↔' };
const dateName = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-PE', { ...options, timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const safeCell = (value: string) => `"${(/^[=+@\-\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;

export default function MovementsTable({ movements, demo = false, accounts = [], categories = [], today = '' }: { movements: PrivateMovement[]; demo?: boolean; accounts?: MovementAccount[]; categories?: MovementCategory[]; today?: string }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [month, setMonth] = useState('all');
  const [editing, setEditing] = useState<PrivateMovement | null>(null);
  const [removing, setRemoving] = useState<PrivateMovement | null>(null);
  const editDialog = useRef<HTMLDialogElement>(null);
  const removeDialog = useRef<HTMLDialogElement>(null);
  const [removeState, removeAction, removePending] = useActionState((_previous: { message: string; success: boolean }, form: FormData) => removeMovement(form), { message: '', success: false });
  useEffect(() => { if (editing) editDialog.current?.showModal(); }, [editing]);
  useEffect(() => { if (removing) removeDialog.current?.showModal(); }, [removing]);
  useEffect(() => { if (removeState.success) setRemoving(null); }, [removeState.success]);
  const months = useMemo(() => [...new Set(movements.map(m => m.occurred_on.slice(0, 7)))].sort().reverse(), [movements]);
  const filtered = useMemo(() => movements.filter(m => {
    const text = `${m.description} ${m.account_name} ${m.destination_name || ''} ${m.category_name || ''}`.toLocaleLowerCase('es-PE');
    return text.includes(query.trim().toLocaleLowerCase('es-PE')) && (kind === 'all' || kind === m.kind) && (month === 'all' || m.occurred_on.startsWith(month));
  }).sort((a, b) => b.occurred_on.localeCompare(a.occurred_on)), [movements, query, kind, month]);
  const hasFilters = !!query || kind !== 'all' || month !== 'all';
  function resetFilters() { setQuery(''); setKind('all'); setMonth('all'); }
  function exportCsv() {
    const rows = [['Fecha', 'Descripción', 'Cuenta', 'Categoría o destino', 'Tipo', 'Importe PEN'], ...filtered.map(m => [m.occurred_on, m.description, m.account_name, m.destination_name || m.category_name || '', kinds[m.kind] || m.kind, m.amount])];
    const csv = rows.map(row => row.map(safeCell).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = demo ? 'movimientos-demo.csv' : 'mis-movimientos.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={d.dashboard}>
    <section className={s.ledger} aria-labelledby="ledger-title">
    <div className={s.ledgerHeading}><div><h2 id="ledger-title">Historial</h2></div><button className={s.export} onClick={exportCsv} disabled={!filtered.length} aria-label="Exportar CSV con los filtros actuales">↓ <span>Exportar CSV</span></button></div>
    <div className={s.filters}><label className={s.search}><span className={s.srOnly}>Buscar movimientos</span><div><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Descripción, cuenta o categoría" /></div></label><label><span className={s.srOnly}>Mes</span><select value={month} onChange={event => setMonth(event.target.value)}><option value="all">Todos los meses</option>{months.map(value => <option key={value} value={value}>{dateName(`${value}-01`, { month: 'long', year: 'numeric' })}</option>)}</select></label></div>
    <div className={s.typeFilters} role="group" aria-label="Filtrar por tipo de movimiento">{[['all', 'Todos'], ['income', 'Ingresos'], ['expense', 'Gastos'], ['transfer', 'Transferencias']].map(([value, label]) => <button key={value} aria-pressed={kind === value} className={kind === value ? s.activeFilter : ''} onClick={() => setKind(value)}>{value !== 'all' && <span aria-hidden="true">{icons[value]}</span>}{label}</button>)}</div>
    <div className={s.results}><span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'movimiento' : 'movimientos'}{hasFilters ? (filtered.length === 1 ? ' encontrado' : ' encontrados') : ''}</span>{hasFilters && <button onClick={resetFilters}>Limpiar filtros ×</button>}</div>
    {!!filtered.length && <div className={d.tableScroll} tabIndex={0} aria-label="Tabla de movimientos; desplaza horizontalmente para ver todas las columnas"><table className={d.table}><thead><tr><th>Movimiento</th><th>Fecha</th><th>Cuenta</th><th>Tipo</th><th>Importe</th>{!demo && <th><span className={s.srOnly}>Acciones</span></th>}</tr></thead><tbody>{filtered.map(m => <tr key={m.id}><td><div className={d.transaction}><span className={[s.movementIcon, s[m.kind]].join(' ')} aria-hidden="true">{icons[m.kind]}</span><div><strong>{m.description}</strong><small>{m.kind === 'transfer' ? 'Destino: ' + (m.destination_name || 'Cuenta de destino') : m.category_name || kinds[m.kind]}</small></div></div></td><td>{dateName(m.occurred_on, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td>{m.account_name}</td><td><span className={[s.typeBadge, s[m.kind]].join(' ')}>{kinds[m.kind]}</span></td><td className={[d.amount, m.kind === 'income' ? s.incomeAmount : m.kind === 'expense' ? s.expenseAmount : s.transferAmount].join(' ')}>{m.kind === 'income' ? '+' : m.kind === 'expense' ? '−' : ''}{soles(m.amount)}</td>{!demo && <td><div className={d.actions}><button type="button" onClick={() => setEditing(m)} aria-label={'Editar ' + m.description} title="Editar">✎</button><button type="button" onClick={() => setRemoving(m)} aria-label={'Eliminar ' + m.description} title="Eliminar">×</button></div></td>}</tr>)}</tbody></table></div>}
    {!filtered.length && <div className={s.empty}><span aria-hidden="true">{movements.length ? '⌕' : '↔'}</span><h3>{movements.length ? 'Sin resultados' : 'Aún no hay movimientos'}</h3><p>{movements.length ? 'Prueba otra búsqueda o limpia los filtros.' : 'Tu primer registro aparecerá aquí.'}</p>{hasFilters ? <button className={s.export} onClick={resetFilters}>Ver todos los movimientos</button> : null}</div>}
    </section>
    <dialog ref={editDialog} className={s.editDialog} onClose={() => setEditing(null)} onCancel={() => setEditing(null)}>
      {editing && <div className={s.editSurface}><div className={s.dialogHeading}><div><span className={s.eyebrow}>AJUSTA LOS DETALLES</span><h2>Editar movimiento</h2></div><button type="button" className={s.dialogClose} onClick={() => editDialog.current?.close()} aria-label="Cerrar edición">×</button></div><MovementForm key={editing.id} accounts={accounts} categories={categories} today={today} requestId={crypto.randomUUID()} modal editingMovement={{ ...editing, category_id: editing.category_id ?? null }} onSuccess={() => editDialog.current?.close()} onCancel={() => editDialog.current?.close()} /></div>}
    </dialog>
    <dialog ref={removeDialog} className={s.deleteDialog} aria-labelledby="delete-title" aria-describedby="delete-record" onClose={() => setRemoving(null)} onCancel={event => { if (removePending) event.preventDefault(); }}>
      {removing && <div className={s.deleteSurface}>
        <div className={s.deleteArtwork} aria-hidden="true"><span className={s.deleteOrbit} /><span className={s.deleteSpark}>✦</span><span className={s.deleteIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3m3 0-.7 12a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8L6 7m4 4v6m4-6v6" /></svg></span><span className={s.deleteSparkSmall}>✧</span></div>
        <h2 id="delete-title">¿Eliminar movimiento?</h2>
        <div className={s.deleteRecord} id="delete-record"><span className={`${s.deleteRecordIcon} ${s[removing.kind]}`} aria-hidden="true">{icons[removing.kind]}</span><div><strong>{removing.description}</strong><small>{kinds[removing.kind]} · {dateName(removing.occurred_on, { day: 'numeric', month: 'short', year: 'numeric' })}</small></div><b>{soles(removing.amount)}</b></div>
        {removeState.message && !removeState.success && <p className={s.deleteError} role="alert">{removeState.message}</p>}
        <form action={removeAction}><input type="hidden" name="movement_id" value={removing.id} /><div className={s.deleteActions}><button type="button" className={s.keepButton} onClick={() => removeDialog.current?.close()} disabled={removePending} autoFocus>Conservar movimiento</button><button type="submit" className={s.deleteButton} disabled={removePending}>{removePending ? 'Eliminando…' : 'Sí, eliminar'}</button></div></form>
      </div>}
    </dialog>
  </div>;
}
