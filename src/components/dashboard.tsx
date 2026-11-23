"use client";

import { validatePiggybankName, balanceAfterTopUp, remainingAfterRelease, accountAllocation, assertReservations, validatePiggybank } from "@/lib/piggybank-policy.mjs";
import type { Piggybank, PiggybankActions } from "./account-detail";
import CreditCards from "./credit-cards";
import { creditCards, validateCard } from "@/lib/credit.mjs";
import type { MovementAccount } from "./movement-fields";
import SettingsWorkspace from "./settings-workspace";
import { useState, useRef } from "react";
import DashboardShell, { navigation } from "./dashboard-shell";
import MonthlySummary from "@/app/privado/monthly-summary";
import HabitsDemo from "./habits-demo";
import MovementsWorkspace from "./movements-workspace";
import MovementsTable from "@/app/privado/movements-table";
import DemoMovementForm, { demoAccounts, demoCategories, type DemoMovementDraft } from "./demo-movement-form";
import AccountsDemo from "./accounts-demo";
import CategoriesDemo from "./categories-demo";
import MovementModal from "./movement-modal";
import { totals, toCents, decimal } from "@/lib/money.mjs";
import { validCategoryIcon } from "@/lib/category-icons.mjs";
import { validateGoalEdit } from "@/lib/goal-edit-policy.mjs";
import GoalsWorkspace, { SavingsGoalCard, type SavingsGoal } from "./goals-workspace";
import GoalCreateForm from "./goal-create-form";
import SummaryGoal from "./summary-goal";
import PlanningDemo from "./planning-demo";

const exampleGoals: SavingsGoal[] = [{ id: 'example-travel', name: 'Un viaje para recordar', target_amount: '1200.00', saved: '480.00', target_on: null, account_id: 'example', account_name: 'Ahorro ilustrativo' }];

type Section = "Resumen" | "Movimientos" | "Cuentas" | "Categorías" | "Planificación" | "Pagos futuros" | "Hábitos y recompensas" | "Configuración";
type Movement = { id: number; name: string; category: string; amount: number; date: string; kind?: string; categoryId?: string; accountId?: string; destinationId?: string | null; account?: string; destination?: string | null };

const initial: Movement[] = [
  { id: 1, name: "Compra de la semana", category: "Alimentación", amount: -18650, date: "2026-11-10" },
  { id: 2, name: "Taxi a la oficina", category: "Transporte", amount: -1850, date: "2026-11-09" },
  { id: 3, name: "Café con amigos", category: "Ocio", amount: -3200, date: "2026-11-08" },
  { id: 4, name: "Ingreso mensual", category: "Ingresos", amount: 420000, date: "2026-11-01" },
].map(movement => ({ ...movement, accountId: 'cash', categoryId: demoCategories.find(category => category.name === movement.category)?.id }));
const money = (cents: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(cents / 100);


export default function Dashboard() {
  const [demoGoals, setDemoGoals] = useState(exampleGoals);
  const [section, setSection] = useState<Section>("Resumen");
  const [movements, setMovements] = useState(initial);
  const [accounts, setAccounts] = useState<MovementAccount[]>([...demoAccounts, { id: 'credit-demo', name: 'Visa personal', account_type: 'credit', credit_limit: '5000.00', opening_debt: '0.00', last_four: '2026' }]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; kind: string; icon?: string | null }>>(demoCategories);
  const [piggybanks, setPiggybanks] = useState<Piggybank[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  const [notice, setNotice] = useState("");

  const sharedMovements = movements.map(m => ({ id: String(m.id), currency: accounts.find(a => a.id === (m.accountId || "cash"))?.currency || "PEN", kind: m.kind || (m.amount > 0 ? "income" : "expense"), description: m.name, occurred_on: m.date, amount: (Math.abs(m.amount) / 100).toFixed(2), account_id: m.accountId || "cash", destination_id: m.destinationId || null, account_type: accounts.find(a => a.id === (m.accountId || "cash"))?.account_type, destination_type: accounts.find(a => a.id === m.destinationId)?.account_type || null, account_name: accounts.find(a => a.id === (m.accountId || "cash"))?.name || "Cuenta", destination_name: accounts.find(a => a.id === m.destinationId)?.name || null, category_id: m.kind === "transfer" ? null : m.categoryId || null, category_name: m.kind === "transfer" ? null : categories.find(category => category.id === m.categoryId)?.name || m.category }));
  const accountTotals = totals(sharedMovements, accounts);
  const cards = creditCards(accounts, sharedMovements);
  const availableByCurrency = Object.fromEntries(['PEN', 'USD'].map(currency => [currency, decimal(cards.filter((card: { currency?: string; available: string }) => (card.currency || 'PEN') === currency).reduce((sum: bigint, card: { available: string }) => sum + toCents(card.available), BigInt(0)))]));
  const cashAccounts = accounts.filter(a => a.account_type !== 'credit');
  function addMovement(movement: DemoMovementDraft) {
    const account = accounts.find(a => a.name === movement.account);
    const destination = accounts.find(a => a.name === movement.destination);
    if (!account || (movement.kind === 'transfer' && (!destination || account.id === destination.id))) return 'Elige una cuenta y destino diferentes.';
    if (account.account_type === 'credit' && movement.kind !== 'expense') return 'Una tarjeta solo admite compras como gasto.';
    const draft = { ...movement, id: Date.now(), categoryId: categories.find(category => category.name === movement.category && category.kind === movement.kind)?.id, accountId: account.id, destinationId: destination?.id || null };
    const proposed = { kind: movement.kind, account_id: account.id, destination_id: destination?.id || null, amount: (Math.abs(movement.amount) / 100).toFixed(2) };
    for (const card of creditCards(accounts, [...sharedMovements, proposed])) {
      if (BigInt(card.debt.replace('.', '')) < BigInt(0)) return 'El pago no puede superar la deuda de la tarjeta.';
      if (BigInt(card.available.replace('.', '')) < BigInt(0)) return 'La compra supera el crédito disponible.';
    }
    try { assertReservations(totals([...sharedMovements, proposed], accounts).accounts, piggybanks); }
    catch { return 'El saldo libre no alcanza. Libera dinero de tus alcancías antes de continuar.'; }
    setMovements(current => [draft, ...current]);
    setFormOpen(false);
    setNotice("Movimiento añadido a la demo. Se borrará al recargar la página.");
  }
  const piggybankChangeRequests = useRef(new Set<string>());
  const piggybankActions: PiggybankActions = {
    rename: async (id, inputName) => {
      if (!piggybanks.some(bank => bank.id === id)) return { success: false, message: 'La alcancía ya no está disponible.' };
      try {
        const name = validatePiggybankName(inputName);
        setPiggybanks(current => current.map(bank => bank.id === id ? { ...bank, name } : bank));
        return { success: true, message: 'Nombre de alcancía actualizado en la demo.' };
      } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa el nombre.' }; }
    },
    create: async form => {
      try {
        const accountId = String(form.get('account_id'));
        if (!cashAccounts.some(a => a.id === accountId)) return { success: false, message: 'La cuenta ya no está disponible.' };
        const value = validatePiggybank(Object.fromEntries(form), '2026-11-11');
        const existing = piggybanks.filter(bank => bank.account_id === accountId);
        const slot = [1, 2, 3, 4].find(slot => !existing.some(bank => bank.slot === slot));
        if (!slot) return { success: false, message: 'Ya tienes cuatro alcancías en esta cuenta.' };
        if (toCents(value.amount) > BigInt(accountAllocation(accountTotals.accounts[accountId] || '0.00', existing).free.replace('.', ''))) return { success: false, message: 'El importe supera el dinero libre de esta cuenta.' };
        const bank = { ...value, id: String(form.get('id')), account_id: accountId, slot };
        setPiggybanks(current => current.some(item => item.id === bank.id) ? current : [...current, bank]);
        return { success: true, message: 'Dinero separado. Los cambios de la demo se reinician al recargar.' };
      } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa los datos de la alcancía.' }; }
    },
    topUp: async (id, amount, requestId) => {
      if (piggybankChangeRequests.current.has(requestId)) return { success: true, message: 'Dinero agregado a tu alcancía.' };
      const bank = piggybanks.find(bank => bank.id === id);
      if (!bank) return { success: false, message: 'La alcancía ya no está disponible.' };
      try {
        const balance = balanceAfterTopUp(bank.amount, amount);
        const free = accountAllocation(accountTotals.accounts[bank.account_id] || '0.00', piggybanks.filter(item => item.account_id === bank.account_id)).free;
        if (toCents(amount) > toCents(free)) return { success: false, message: 'El saldo libre no alcanza para agregar ese importe.' };
        piggybankChangeRequests.current.add(requestId);
        setPiggybanks(current => current.map(item => item.id === id ? { ...item, amount: balance } : item));
        return { success: true, message: 'Dinero agregado a tu alcancía.' };
      } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa el importe.' }; }
    },
    release: async (id, amount, expectedBalance, requestId) => {
      if (piggybankChangeRequests.current.has(requestId)) return { success: true, message: 'El dinero vuelve a estar libre en esta cuenta.' };
      const bank = piggybanks.find(bank => bank.id === id);
      if (!bank) return { success: false, message: 'La alcancía ya no está disponible.' };
      try {
        const remaining = remainingAfterRelease(bank.amount, amount, expectedBalance);
        piggybankChangeRequests.current.add(requestId);
        setPiggybanks(current => remaining === '0.00' ? current.filter(bank => bank.id !== id) : current.map(bank => bank.id === id ? { ...bank, amount: remaining } : bank));
        return { success: true, message: 'El dinero vuelve a estar libre en esta cuenta.' };
      } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa el importe.' }; }
    },
  };
  const cardWorkspace = <CreditCards update={async (id, form) => {
    const existing = accounts.find(a => a.id === id && a.account_type === 'credit');
    if (!existing) return { success: false, message: 'La tarjeta ya no está disponible.' };
    try {
      const value = validateCard({ ...Object.fromEntries(form), opening_debt: existing.opening_debt });
      if (accounts.some(a => a.id !== id && a.name.localeCompare(value.name, 'es', { sensitivity: 'base' }) === 0)) return { success: false, message: 'Ya tienes una cuenta o tarjeta con ese nombre.' };
      const card = cards.find((card: { id: string }) => card.id === id);
      if (toCents(value.credit_limit) < toCents(card.debt)) return { success: false, message: 'La línea no puede ser menor que la deuda actual.' };
      setAccounts(current => current.map(a => a.id === id ? { ...a, ...value } : a));
      return { success: true, message: 'Tarjeta actualizada en la demo.' };
    } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa los datos.' }; }
  }} remove={async id => {
    const card = accounts.find(a => a.id === id && a.account_type === 'credit');
    if (!card) return { success: false, message: 'La tarjeta ya no está disponible.' };
    if (toCents(card.opening_debt || '0') > BigInt(0)) return { success: false, message: 'Esta tarjeta tiene deuda inicial y no se puede eliminar.' };
    if (sharedMovements.some(m => m.account_id === id || m.destination_id === id)) return { success: false, message: 'Esta tarjeta tiene movimientos asociados. Conservamos su historial.' };
    setAccounts(current => current.filter(a => a.id !== id));
    return { success: true, message: 'Tarjeta eliminada de la demo.' };
  }} cards={cards} accounts={cashAccounts} today="2026-11-11" create={async form => {
    try {
      const card = validateCard(Object.fromEntries(form));
      if (accounts.some(a => a.name.localeCompare(card.name, 'es', { sensitivity: 'base' }) === 0)) return { success: false, message: 'Ya tienes una cuenta o tarjeta con ese nombre.' };
      setAccounts(current => [...current, { ...card, id: crypto.randomUUID(), account_type: 'credit' }]);
      return { success: true, message: 'Tarjeta añadida a la demo.' };
    } catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa los datos.' }; }
  }} pay={async form => {
    const account = cashAccounts.find(a => a.id === form.get('account_id'));
    const destination = cards.find((a: { id: string }) => a.id === form.get('destination_id'));
    if (!account || !destination) return { success: false, message: 'Revisa la cuenta y la tarjeta.' };
    try {
      const cents = toCents(String(form.get('amount')));
      const date = String(form.get('occurred_on'));
      if (cents <= BigInt(0) || date < '1900-01-01' || date > '2026-11-11' || new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) throw new Error();
      const error = addMovement({ name: String(form.get('description')), category: 'Transferencia', amount: Number(cents), date, kind: 'transfer', account: account.name, destination: destination.name });
      return { success: !error, message: error || 'Pago registrado en la demo.' };
    } catch { return { success: false, message: 'Revisa el importe y la fecha.' }; }
  }} />;
  return <DashboardShell demo active={navigation.find(item => item.label === section)!.id} onNewMovement={() => setFormOpen(true)} onNavigate={id => { setSection(navigation.find(item => item.id === id)!.label); setNotice(""); }}>
      <div className="content">
        {section !== "Configuración" && section !== "Planificación" && section !== "Pagos futuros" && <>{section !== "Cuentas" && section !== "Categorías" && <div className="page-heading"><div>{(section !== "Resumen" && section !== "Movimientos") && <div className="eyebrow">TU DINERO, CON PROPÓSITO</div>}<h1>{section === "Resumen" ? "Tu resumen" : section}</h1>{(section !== "Resumen" && section !== "Movimientos") && <p>Reconoce tus avances cotidianos y suma puntos virtuales.</p>}</div></div>}
        <div className="demo-note">{(section === "Cuentas" || section === "Categorías" || section === "Resumen" || section === "Movimientos") ? "Datos de ejemplo · Los cambios se reinician al recargar." : "Estás explorando datos de ejemplo. Los cambios que hagas aquí solo viven en esta página y se reinician al recargar; nada se guarda en una cuenta ni en una base de datos."}</div>
        <p className="notice" role="status">{notice}</p>
        </>}
        {section === "Configuración" && <SettingsWorkspace demo creditCards={cardWorkspace} />}
        {section === "Resumen" && <>
          <MonthlySummary currentMonth="2026-11" balance={accountTotals.balance} demo onRegister={() => setFormOpen(true)} onViewMovements={() => setSection("Movimientos")} movements={sharedMovements} />
          <SummaryGoal demo goal={demoGoals[0]} onOpen={() => setSection("Planificación")} />
        </>}

        {section === "Movimientos" && <MovementsWorkspace><MovementsTable movements={sharedMovements} demo /></MovementsWorkspace>}
        {section === "Cuentas" && <AccountsDemo movements={sharedMovements} piggybanks={piggybanks} piggybankActions={piggybankActions} creditSection={cardWorkspace} currencyTotals={accountTotals.byCurrency || {}} availableByCurrency={availableByCurrency} accounts={cashAccounts} balances={accountTotals.accounts} saveOrder={async ids => { setAccounts(current => [...ids.map(id => current.find(account => account.id === id)!).filter(Boolean), ...current.filter(a => a.account_type === 'credit')]); return { success: true, message: 'Orden actualizado en la demo.' }; }} toggleSummaryAccount={async (id, selected) => { if (!accounts.some(account => account.id === id && account.account_type !== 'credit')) return { success: false, message: 'La cuenta ya no está disponible.' }; setAccounts(current => current.map(account => account.id === id ? { ...account, summary_selected: selected } : account)); return { success: true, message: selected ? 'Cuenta incluida en el total de la demo.' : 'Cuenta excluida del total de la demo.' }; }} renameAccount={async (id, name, bank) => {
          const trimmed = name.trim();
          if (!trimmed || trimmed.length > 80) return { success: false, message: 'Escribe un nombre de hasta 80 caracteres.' };
          if (!accounts.some(account => account.id === id)) return { success: false, message: 'La cuenta ya no está disponible.' };
          if (accounts.some(account => account.id !== id && account.name.localeCompare(trimmed, 'es', { sensitivity: 'base' }) === 0)) return { success: false, message: 'Ya tienes una cuenta con ese nombre.' };
          setAccounts(current => current.map(account => account.id === id ? { ...account, name: trimmed, bank_code: bank } : account));
          return { success: true, message: 'Cuenta actualizada en la demo.' };
        }} removeAccount={async id => {
          if (piggybanks.some(bank => bank.account_id === id)) return { success: false, message: 'Libera sus alcancías antes de eliminar esta cuenta.' };
          if (sharedMovements.some(movement => movement.account_id === id || movement.destination_id === id)) return { success: false, message: 'Esta cuenta tiene movimientos asociados y no se puede eliminar.' };
          setAccounts(current => current.filter(account => account.id !== id));
          return { success: true, message: 'Cuenta eliminada en la demo.' };
        }} onAddAccount={(name, currency = 'PEN', bank = 'BCP', openingBalance = '0.00') => setAccounts(current => [...current, { id: crypto.randomUUID(), name, currency, bank_code: bank, opening_balance: openingBalance || '0.00', summary_selected: true }])} />}
        {section === "Categorías" && <CategoriesDemo categories={categories} movements={sharedMovements} editCategory={async (id, input) => {
          const category = categories.find(item => item.id === id), name = input.name.trim();
          if (!category) return { success: false, message: 'La categoría ya no está disponible.' };
          if (!name || name.length > 80 || !['income', 'expense'].includes(input.kind) || !validCategoryIcon(input.icon)) return { success: false, message: 'Revisa el nombre, tipo e icono.' };
          if (categories.some(item => item.id !== id && item.kind === input.kind && item.name.localeCompare(name, 'es', { sensitivity: 'base' }) === 0)) return { success: false, message: 'Ya tienes una categoría con ese nombre y tipo.' };
          if (input.kind !== category.kind && sharedMovements.some(movement => movement.category_id === id)) return { success: false, message: 'Esta categoría está en uso. Puedes cambiar nombre e icono, pero conserva su tipo.' };
          setCategories(current => current.map(item => item.id === id ? { ...item, ...input, name } : item));
          return { success: true, message: 'Categoría actualizada en la demo.' };
        }} removeCategory={async id => {
          if (!categories.some(item => item.id === id)) return { success: false, message: 'La categoría ya no está disponible.' };
          if (sharedMovements.some(movement => movement.category_id === id)) return { success: false, message: 'Esta categoría tiene movimientos asociados y no se puede eliminar.' };
          setCategories(current => current.filter(item => item.id !== id));
          return { success: true, message: 'Categoría eliminada en la demo.' };
        }} onAddCategory={(name, kind, icon) => setCategories(current => [...current, { id: crypto.randomUUID(), name, kind, icon }])} />}

        {(section === "Planificación" || section === "Pagos futuros") && <PlanningDemo section={section === "Pagos futuros" ? 'pagos' : 'planificacion'} categories={categories} accounts={cashAccounts} movements={sharedMovements} goals={<div id="metas"><GoalsWorkspace goals={demoGoals} demo creation={<GoalCreateForm accounts={cashAccounts} today="2026-11-11" />}>{demoGoals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} demo today="2026-11-11" manage={async (id, mode, input) => {
          const existing = demoGoals.find(goal => goal.id === id);
          if (!existing) return { success: false, message: 'La meta ya no está disponible.' };
          if (mode === 'delete') { setDemoGoals(current => current.filter(goal => goal.id !== id)); return { success: true, message: 'Meta eliminada en la demo.' }; }
          try { const value = validateGoalEdit(input, '2026-11-11', existing.target_on); setDemoGoals(current => current.map(goal => goal.id === id ? { ...goal, ...value } : goal)); return { success: true, message: 'Meta actualizada en la demo.' }; }
          catch (error) { return { success: false, message: error instanceof Error ? error.message : 'Revisa los datos.' }; }
        }} />)}</GoalsWorkspace></div>} />}

        {section === "Hábitos y recompensas" && <HabitsDemo />}

        <footer><span>Vista previa · Datos ficticios</span></footer>
      </div>
    <MovementModal open={formOpen} onClose={() => setFormOpen(false)} demo><DemoMovementForm onAdd={addMovement} accounts={accounts} categories={categories} modal /></MovementModal>
  </DashboardShell>;
}
