import SummaryGoal from '@/components/summary-goal';
import CreditCards from '@/components/credit-cards';
import { creditCards } from '@/lib/credit.mjs';
import { addCreditCard, updateCreditCard, removeCreditCard } from './credit-actions';
import { addMovement } from './actions';
import { readPiggybanks } from '@/lib/piggybanks.mjs';
import { addPiggybank, freePiggybank, increasePiggybank, changePiggybankName } from './piggybank-actions';
import UserDirectory from '@/components/user-directory';
import UserCreateForm from '@/components/user-create-form';
import { editOrDeleteUser, addPrivateUser } from './user-actions';
import { readManagedUsers, isUserAdmin } from '@/lib/user-management.mjs';
import SettingsWorkspace from '@/components/settings-workspace';
import { saveCredentials } from './settings-actions';
import { randomUUID } from 'node:crypto';
import { requireUser } from '@/server/auth';
import { db } from '@/server/db';
import { readDashboard, todayLima } from '@/lib/repository.mjs';
import { soles, decimal, toCents } from '@/lib/money.mjs';
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
import CategoriesSection from '@/components/categories-section';
import { readAvatar } from '@/lib/profile.mjs';
import { updateAvatar } from './profile-actions';
import { updateAccountOrder, editCategory, removeCategory, editAccount, removeAccount, toggleAccountSummary } from './actions';

export const dynamic = 'force-dynamic';
const sections = ['resumen', 'movimientos', 'cuentas', 'categorias', 'planificacion', 'pagos', 'habitos', 'configuracion'] as const;
type Section = typeof sections[number];

export default async function PrivatePage({ searchParams }: { searchParams: Promise<{ seccion?: string | string[] }> }) {
  const user = await requireUser();
  const params = await searchParams;
  const rawSection = Array.isArray(params.seccion) ? params.seccion[0] : params.seccion;
  const requested = rawSection === 'metas' ? 'planificacion' : rawSection;
  const section: Section = sections.includes(requested as Section) ? requested as Section : 'resumen';
  const canCreateUsers = section === 'configuracion' && await isUserAdmin(db(), user.id);
  const managedUsers = canCreateUsers ? await readManagedUsers(db(), user.id) : [];
  const avatar = await readAvatar(db(), user.id);
  const today = todayLima();
  const month = today.slice(0, 7);
  const data = await readDashboard(db(), user.id);
  const cashAccounts = data.accounts.filter((account: { account_type: string }) => account.account_type !== 'credit');
  const piggybanks = section === 'cuentas' ? await readPiggybanks(db(), user.id) : [];
  const cards = creditCards(data.accounts, data.movements);
  const availableByCurrency = Object.fromEntries(['PEN', 'USD'].map(currency => [currency, decimal(cards.filter((card: { currency?: string; available: string }) => (card.currency || 'PEN') === currency).reduce((sum: bigint, card: { available: string }) => sum + toCents(card.available), BigInt(0)))]));
  const cardWorkspace = <CreditCards update={updateCreditCard} remove={removeCreditCard} cards={cards} accounts={cashAccounts} today={today} create={addCreditCard} pay={async (form: FormData) => { 'use server'; return addMovement({ message: '', success: false }, form); }} />;
  const planning = (section === 'planificacion' || section === 'pagos') ? await readPlanning(db(), user.id, month) : null;
  const goals = section === 'planificacion' || section === 'resumen' ? await readGoals(db(), user.id) : null;
  const habits = section === 'habitos' ? await readHabitDashboard(db(), user.id, today) : null;

  return <PrivateDashboardShell active={section} avatar={avatar} saveAvatarAction={updateAvatar} accounts={data.accounts} categories={data.categories} today={today} requestId={randomUUID()} sessionAction={<form action={signOut}><button type="submit">Cerrar sesión</button></form>}>
      <div className="content">
        {section === 'resumen' && data && <>
          <section className="page-heading" id="resumen"><h1>Tu resumen</h1></section>
          <SummaryWithRegistration movements={data.movements} currentMonth={month} balance={data.totals.balance} />
          <SummaryGoal goal={goals?.[0]} />
        </>}
        {section === 'movimientos' && data && <>
          <section className="page-heading"><div><h1>Movimientos</h1></div></section>
          <MovementsWorkspace><MovementsTable movements={data.movements} accounts={data.accounts} categories={data.categories} today={today} /></MovementsWorkspace>
        </>}
        {section === 'cuentas' && data && <>

          <AccountsWorkspace movements={data.movements} piggybanks={piggybanks} piggybankActions={{ create: addPiggybank, release: freePiggybank, topUp: increasePiggybank, rename: changePiggybankName }} today={today} creditSection={cardWorkspace} currencyTotals={data.totals.byCurrency || {}} availableByCurrency={availableByCurrency} accounts={cashAccounts} balances={data.totals.accounts} saveOrder={updateAccountOrder} toggleSummaryAccount={toggleAccountSummary} renameAccount={editAccount} removeAccount={removeAccount} accountForm={<SetupForms />} />
        </>}
        {section === 'categorias' && <CategoriesSection categories={data.categories} movements={data.movements} currentMonth={month} creation={<SetupForms category />} editCategory={editCategory} removeCategory={removeCategory} />}
        {(section === 'planificacion' || section === 'pagos') && data && planning && <PlanningPanel section={section} accounts={cashAccounts} categories={data.categories} budgets={planning.budgets} payments={planning.payments} month={month} today={today} goals={section === 'planificacion' && goals ? <div id="metas"><GoalsPanel accounts={cashAccounts} goals={goals} today={today} /></div> : undefined} />}
        {section === 'habitos' && habits && <><section className="page-heading"><div><span className="eyebrow">PEQUEÑOS PASOS, TODOS LOS DÍAS</span><h1>Hábitos y recompensas</h1><p>Reconoce tus avances cotidianos y elige premios personales.</p></div></section><HabitsRewards data={habits} today={today} /></>}
        {section === 'configuracion' && <SettingsWorkspace userCreation={canCreateUsers ? <UserCreateForm create={addPrivateUser}><UserDirectory users={managedUsers} manage={editOrDeleteUser} /></UserCreateForm> : undefined} email={user.email} saveAction={saveCredentials} creditCards={cardWorkspace} />}
      </div>
  </PrivateDashboardShell>;
}
