import { randomUUID } from 'node:crypto';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { readDashboard, todayLima } from '@/lib/repository.mjs';
import { soles } from '@/lib/money.mjs';
import { signOut } from '@/app/login/actions';
import MovementForm from './movement-form';

export const dynamic = 'force-dynamic';
type Account = { id: string; name: string };
type Movement = { id: string; kind: string; description: string; occurred_on: string; amount: string; account_name: string; destination_name: string | null; category_name: string | null };
export default async function PrivatePage() {
  const user = await requireUser();
  const data = await readDashboard(db(), user.id);
  return <main>
    <header className="topbar"><span>Mi espacio privado</span><form action={signOut}><button className="secondary">Cerrar sesión</button></form></header>
    <div className="content"><div className="page-heading"><div><span className="eyebrow">FINANZAS PERSONALES · PEN</span><h1>Cada paso cuenta.</h1><p>{user.email}</p></div></div>
    <div className="section-bar"><h2>Balance acumulado</h2><span>Todos tus movimientos</span></div>
    <div className="stats">{[['Saldo total', data.totals.balance], ['Ingresos', data.totals.income], ['Gastos', data.totals.expense]].map(([label, value], i) => <article key={label} className={`stat ${i === 0 ? 'balance' : ''}`}><span>{label}</span><strong>{soles(value)}</strong><small>Las transferencias no suman ingresos ni gastos</small></article>)}</div>
    <div className="two-columns"><section className="panel"><h2>Registrar movimiento</h2><MovementForm accounts={data.accounts} categories={data.categories} today={todayLima()} requestId={randomUUID()} /></section>
    <section className="panel"><h2>Tus cuentas</h2>{data.accounts.map((a: Account) => <div className="upcoming" key={a.id}><strong>{a.name}</strong><span>{soles(data.totals.accounts[a.id] || '0.00')}</span></div>)}<p className="panel-foot">Para comenzar, registra como ingreso el saldo inicial de cada cuenta. Los ahorros forman parte del saldo total.</p></section></div>
    <section className="panel"><div className="panel-heading"><h2>Movimientos guardados</h2></div><div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Descripción</th><th>Cuenta</th><th>Categoría / destino</th><th>Tipo</th><th className="amount">Importe</th></tr></thead><tbody>{data.movements.map((m: Movement) => <tr key={m.id}><td>{m.occurred_on.split('-').reverse().join('/')}</td><td>{m.description}</td><td>{m.account_name}</td><td>{m.kind === 'transfer' ? m.destination_name : m.category_name}</td><td>{({ income: 'Ingreso', expense: 'Gasto', transfer: 'Transferencia' } as Record<string, string>)[m.kind]}</td><td className="amount">{soles(m.amount)}</td></tr>)}</tbody></table>{!data.movements.length && <p className="empty">Aún no has registrado movimientos.</p>}</div></section>
    </div></main>;
}
