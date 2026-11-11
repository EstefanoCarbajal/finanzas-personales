import { randomUUID } from 'node:crypto';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { readDashboard, todayLima } from '@/lib/repository.mjs';
import { soles } from '@/lib/money.mjs';
import { readPlanning } from '@/lib/planning.mjs';
import { readGoals } from '@/lib/goals.mjs';
import { readHabitDashboard } from '@/lib/habits.mjs';
import { signOut } from '@/app/login/actions';
import MovementForm from './movement-form';
import SetupForms from './setup-forms';
import MovementsTable from './movements-table';
import MonthlySummary from './monthly-summary';
import PlanningPanel from './planning-panel';
import GoalsPanel from './goals-panel';
import HabitsRewards from './habits-rewards';

export const dynamic = 'force-dynamic';
type Account = { id: string; name: string };
const sections = ['resumen', 'movimientos', 'cuentas', 'planificacion', 'metas', 'habitos'] as const;
type Section = typeof sections[number];
const sectionLabels: Record<Section, string> = { resumen: 'Resumen', movimientos: 'Movimientos', cuentas: 'Cuentas', planificacion: 'Planificación', metas: 'Metas y ahorro', habitos: 'Hábitos y recompensas' };
const sectionIcons: Record<Section, string> = { resumen: '◫', movimientos: '↔', cuentas: '▦', planificacion: '◷', metas: '◇', habitos: '✧' };

export default async function PrivatePage({ searchParams }: { searchParams: Promise<{ seccion?: string | string[] }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const requested = Array.isArray(params.seccion) ? params.seccion[0] : params.seccion;
  const section: Section = sections.includes(requested as Section) ? requested as Section : 'resumen';
  const avatar = user.email.slice(0, 1).toUpperCase();
  const today = todayLima();
  const month = today.slice(0, 7);
  const needsDashboard = section !== 'habitos';
  const data = needsDashboard ? await readDashboard(db(), user.id) : null;
  const planning = section === 'planificacion' ? await readPlanning(db(), user.id, month) : null;
  const goals = section === 'metas' || section === 'resumen' ? await readGoals(db(), user.id) : null;
  const habits = section === 'habitos' ? await readHabitDashboard(db(), user.id, today) : null;

  return <div className="app-shell private-shell">
    <aside className="sidebar">
      <a className="brand" href="/privado" aria-label="Finanzas personales, resumen privado"><img className="brand-mark" src="/koala.svg" alt="" /><span>finanzas<span className="brand-sub">PERSONALES</span></span></a>
      <div className="workspace-label">TU ESPACIO PERSONAL</div>
      <nav aria-label="Navegación del espacio privado">
        {sections.map(item => <a key={item} className={section === item ? 'nav-item active' : 'nav-item'} href={`/privado?seccion=${item}`} aria-current={section === item ? 'page' : undefined}><span aria-hidden="true">{sectionIcons[item]}</span>{sectionLabels[item]}</a>)}
      </nav>
      <div className="sidebar-tip"><span className="tip-icon" aria-hidden="true">✧</span><h3>Pequeños pasos.<br />Grandes metas.</h3><p>Un poco de claridad hoy, más tranquilidad mañana.</p></div>
      <div className="profile"><span className="avatar">{avatar}</span><div><strong>Mi espacio</strong><small>Acceso privado</small></div><span className="profile-dot" /></div>
    </aside>
    <main>
      <header className="topbar"><span>Mi espacio <span className="breadcrumb">/ {sectionLabels[section]}</span></span><div className="private-top-actions"><span className="demo-badge private-badge">ACCESO PRIVADO</span><form action={signOut}><button className="secondary">Cerrar sesión</button></form></div></header>
      <div className="content">
        {section === 'resumen' && data && <>
          <section className="page-heading" id="resumen"><div><span className="eyebrow">TU DINERO, CON PROPÓSITO · PEN</span><h1>Cada paso cuenta.</h1><p>Hola, {user.email}. Aquí tienes una mirada clara a tus cuentas.</p></div></section>
          <div className="section-bar"><h2>Tu balance acumulado</h2><span className="month-pill">Todos tus movimientos</span></div>
          <div className="stats">{[['Saldo total', data.totals.balance], ['Ingresos', data.totals.income], ['Gastos', data.totals.expense]].map(([label, value], i) => <article key={label} className={`stat ${i === 0 ? 'balance' : ''}`}><span>{label}{i === 0 && <span aria-hidden="true"> ↗</span>}</span><strong>{soles(String(value))}</strong><small>{i === 0 ? 'Saldo entre todas tus cuentas' : 'Las transferencias no se incluyen'}</small></article>)}</div>
          <MonthlySummary movements={data.movements} currentMonth={month} />
          {goals?.[0] && <section className="private-goal-feature"><div className="goal-top"><span className="eyebrow">UNA META A LA VEZ</span><span className="goal-symbol" aria-hidden="true">☀</span></div><h2>{goals[0].name}</h2><p>Tu próximo paso empieza hoy.</p><div className="goal-amount"><strong>{soles(goals[0].saved)}</strong><span>de {soles(goals[0].target_amount)}</span></div><progress aria-label={`Avance de ${goals[0].name}`} value={Math.min(100, Number(BigInt(goals[0].saved.replace('.', '')) * BigInt(100) / BigInt(goals[0].target_amount.replace('.', ''))))} max={100} /><div className="goal-bottom"><span>Avanza a tu ritmo</span><a href="/privado?seccion=metas">Ver meta →</a></div></section>}
          <section className="panel summary-next"><div className="panel-heading"><div><h2>Sigue a tu ritmo</h2><p>Elige una sección para continuar organizando tus finanzas.</p></div></div><div className="summary-links">{sections.slice(1).map(item => <a className="summary-link" key={item} href={`/privado?seccion=${item}`}><span aria-hidden="true">{sectionIcons[item]}</span><strong>{sectionLabels[item]}</strong><span aria-hidden="true">→</span></a>)}</div></section>
        </>}
        {section === 'movimientos' && data && <>
          <section className="page-heading"><div><span className="eyebrow">TU ACTIVIDAD FINANCIERA</span><h1>Movimientos</h1><p>Registra y encuentra ingresos, gastos y transferencias.</p></div></section>
          <div className="two-columns private-columns"><section className="panel"><div className="panel-heading"><div><h2>Registrar movimiento</h2><p>Los cambios se guardan en tu espacio.</p></div><span className="private-panel-icon" aria-hidden="true">＋</span></div><MovementForm accounts={data.accounts} categories={data.categories} today={today} requestId={randomUUID()} /></section><section className="panel"><h2>Saldo acumulado</h2><div className="big-number">{soles(data.totals.balance)} <small>en total</small></div><p className="subtle">Las transferencias no se cuentan como ingresos ni gastos.</p></section></div>
          <section className="panel private-movements"><div className="panel-heading"><div><h2>Movimientos guardados</h2><p>Busca, filtra o descarga tu actividad</p></div><span className="private-panel-icon movement-icon" aria-hidden="true">↔</span></div><MovementsTable movements={data.movements} /></section>
        </>}
        {section === 'cuentas' && data && <>
          <section className="page-heading"><div><span className="eyebrow">TU DINERO ORGANIZADO</span><h1>Cuentas</h1><p>Consulta tus saldos y personaliza cómo organizas tus movimientos.</p></div></section>
          <section className="panel account-list-panel"><div className="panel-heading"><div><h2>Tus cuentas</h2><p>Saldo por cuenta</p></div><span className="private-panel-icon account-icon" aria-hidden="true">▦</span></div>{data.accounts.map((account: Account) => <div className="upcoming account-row" key={account.id}><span className="account-dot" aria-hidden="true" /><strong>{account.name}</strong><span>{soles(data.totals.accounts[account.id] || '0.00')}</span></div>)}<p className="panel-foot">Los ahorros forman parte de tu saldo total.</p></section>
          <SetupForms />
        </>}
        {section === 'planificacion' && data && planning && <><section className="page-heading"><div><span className="eyebrow">PLANIFICA CON CALMA</span><h1>Planificación</h1><p>Presupuestos y pagos futuros en un solo lugar.</p></div></section><PlanningPanel accounts={data.accounts} categories={data.categories} budgets={planning.budgets} payments={planning.payments} month={month} today={today} /></>}
        {section === 'metas' && data && goals && <><section className="page-heading"><div><span className="eyebrow">AHORRA A TU MANERA</span><h1>Metas y ahorro</h1><p>Define un objetivo y avanza con aportes entre tus cuentas.</p></div></section><GoalsPanel accounts={data.accounts} goals={goals} today={today} /></>}
        {section === 'habitos' && habits && <><section className="page-heading"><div><span className="eyebrow">PEQUEÑOS PASOS, TODOS LOS DÍAS</span><h1>Hábitos y recompensas</h1><p>Reconoce tus avances cotidianos y elige premios personales.</p></div></section><HabitsRewards data={habits} today={today} /></>}
        <footer>Hecho para avanzar a tu ritmo.<span>Tus datos están en tu espacio privado</span></footer>
      </div>
    </main>
  </div>;
}
