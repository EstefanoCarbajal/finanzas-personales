import { randomUUID } from 'node:crypto';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { readDashboard, todayLima } from '@/lib/repository.mjs';
import { soles } from '@/lib/money.mjs';
import { readPlanning } from '@/lib/planning.mjs';
import { readGoals } from '@/lib/goals.mjs';
import { readHabitDashboard } from '@/lib/habits.mjs';
import { signOut } from '@/app/login/actions';
import MovementsWorkspace from '@/components/movements-workspace';
import SetupForms from './setup-forms';
import MovementsTable from './movements-table';
import SummaryWithRegistration from './summary-with-registration';
import PlanningPanel from './planning-panel';
import GoalsPanel from './goals-panel';
import HabitsRewards from './habits-rewards';
import PrivateDashboardShell from './private-dashboard-shell';
import AccountsWorkspace from '@/components/accounts-workspace';
import { readAvatar } from '@/lib/profile.mjs';
import { updateAvatar } from './profile-actions';

export const dynamic = 'force-dynamic';
const sections = ['resumen', 'movimientos', 'cuentas', 'planificacion', 'metas', 'habitos'] as const;
type Section = typeof sections[number];

export default async function PrivatePage({ searchParams }: { searchParams: Promise<{ seccion?: string | string[] }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const requested = Array.isArray(params.seccion) ? params.seccion[0] : params.seccion;
  const section: Section = sections.includes(requested as Section) ? requested as Section : 'resumen';
  const avatar = await readAvatar(db(), user.id);
  const today = todayLima();
  const month = today.slice(0, 7);
  const data = await readDashboard(db(), user.id);
  const planning = section === 'planificacion' ? await readPlanning(db(), user.id, month) : null;
  const goals = section === 'metas' || section === 'resumen' ? await readGoals(db(), user.id) : null;
  const habits = section === 'habitos' ? await readHabitDashboard(db(), user.id, today) : null;

  return <PrivateDashboardShell active={section} avatar={avatar} saveAvatarAction={updateAvatar} accounts={data.accounts} categories={data.categories} today={today} requestId={randomUUID()} sessionAction={<form action={signOut}><button type="submit">Cerrar sesión</button></form>}>
      <div className="content">
        {section === 'resumen' && data && <>
          <section className="page-heading" id="resumen"><h1>Tu resumen</h1></section>
          <SummaryWithRegistration movements={data.movements} currentMonth={month} balance={data.totals.balance} />
          {goals?.[0] && <section className="private-goal-feature"><div className="goal-top"><span className="eyebrow">TU META</span><span className="goal-symbol" aria-hidden="true">☀</span></div><h2>{goals[0].name}</h2><div className="goal-amount"><strong>{soles(goals[0].saved)}</strong><span>de {soles(goals[0].target_amount)}</span></div><progress aria-label={`Avance de ${goals[0].name}`} value={Math.min(100, Number(BigInt(goals[0].saved.replace('.', '')) * BigInt(100) / BigInt(goals[0].target_amount.replace('.', ''))))} max={100} /><div className="goal-bottom"><a href="/privado?seccion=metas">Ver meta →</a></div></section>}
        </>}
        {section === 'movimientos' && data && <>
          <section className="page-heading"><div><h1>Movimientos</h1></div></section>
          <MovementsWorkspace><MovementsTable movements={data.movements} accounts={data.accounts} categories={data.categories} today={today} /></MovementsWorkspace>
        </>}
        {section === 'cuentas' && data && <>
          <section className="page-heading"><h1>Cuentas</h1></section>
          <AccountsWorkspace accounts={data.accounts} categories={data.categories} balances={data.totals.accounts} balance={data.totals.balance} accountForm={<SetupForms />} categoryForm={<SetupForms category />} />
        </>}
        {section === 'planificacion' && data && planning && <><section className="page-heading"><div><span className="eyebrow">PLANIFICA CON CALMA</span><h1>Planificación</h1><p>Presupuestos y pagos futuros en un solo lugar.</p></div></section><PlanningPanel accounts={data.accounts} categories={data.categories} budgets={planning.budgets} payments={planning.payments} month={month} today={today} /></>}
        {section === 'metas' && data && goals && <><section className="page-heading"><div><span className="eyebrow">AHORRA A TU MANERA</span><h1>Metas y ahorro</h1><p>Define un objetivo y avanza con aportes entre tus cuentas.</p></div></section><GoalsPanel accounts={data.accounts} goals={goals} today={today} /></>}
        {section === 'habitos' && habits && <><section className="page-heading"><div><span className="eyebrow">PEQUEÑOS PASOS, TODOS LOS DÍAS</span><h1>Hábitos y recompensas</h1><p>Reconoce tus avances cotidianos y elige premios personales.</p></div></section><HabitsRewards data={habits} today={today} /></>}
        <footer>Hecho para avanzar a tu ritmo.<span>Tus datos están en tu espacio privado</span></footer>
      </div>
  </PrivateDashboardShell>;
}
