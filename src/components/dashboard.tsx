"use client";

import { useState } from "react";
import DashboardShell, { navigation } from "./dashboard-shell";
import MonthlySummary from "@/app/privado/monthly-summary";
import HabitsDemo from "./habits-demo";
import MovementsWorkspace from "./movements-workspace";
import MovementsTable from "@/app/privado/movements-table";
import DemoMovementForm, { demoAccounts, demoCategories, type DemoMovementDraft } from "./demo-movement-form";
import AccountsDemo from "./accounts-demo";
import MovementModal from "./movement-modal";
import { totals } from "@/lib/money.mjs";

type Section = "Resumen" | "Movimientos" | "Cuentas" | "Planificación" | "Metas y ahorro" | "Hábitos y recompensas";
type Movement = { id: number; name: string; category: string; amount: number; date: string; kind?: string; account?: string; destination?: string | null };

const initial: Movement[] = [
  { id: 1, name: "Compra de la semana", category: "Alimentación", amount: -18650, date: "2026-11-10" },
  { id: 2, name: "Taxi a la oficina", category: "Transporte", amount: -1850, date: "2026-11-09" },
  { id: 3, name: "Café con amigos", category: "Ocio", amount: -3200, date: "2026-11-08" },
  { id: 4, name: "Ingreso mensual", category: "Ingresos", amount: 420000, date: "2026-11-01" },
];
const money = (cents: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(cents / 100);

const sections: { label: Section; icon: string }[] = [
  { label: "Resumen", icon: "◫" },
  { label: "Movimientos", icon: "↔" },
  { label: "Cuentas", icon: "▤" },
  { label: "Planificación", icon: "▦" },
  { label: "Metas y ahorro", icon: "◇" },
  { label: "Hábitos y recompensas", icon: "✧" },
];


export default function Dashboard() {
  const [section, setSection] = useState<Section>("Resumen");
  const [movements, setMovements] = useState(initial);
  const [accounts, setAccounts] = useState(demoAccounts);
  const [categories, setCategories] = useState(demoCategories);
  const [formOpen, setFormOpen] = useState(false);

  const [notice, setNotice] = useState("");

  const income = movements.filter(m => m.amount > 0 && m.kind !== "transfer").reduce((a, m) => a + m.amount, 0);
  const expense = -movements.filter(m => m.amount < 0).reduce((a, m) => a + m.amount, 0);
  const sharedMovements = movements.map(m => ({ id: String(m.id), kind: m.kind || (m.amount > 0 ? "income" : "expense"), description: m.name, occurred_on: m.date, amount: (Math.abs(m.amount) / 100).toFixed(2), account_id: accounts.find(a => a.name === (m.account || "Efectivo"))!.id, destination_id: accounts.find(a => a.name === m.destination)?.id || null, account_name: m.account || "Efectivo", destination_name: m.destination || null, category_name: m.kind === "transfer" ? null : m.category }));
  const accountTotals = totals(sharedMovements);
  function addMovement(movement: DemoMovementDraft) {
    setMovements(current => [{ ...movement, id: Date.now() }, ...current]);
    setFormOpen(false);
    setNotice("Movimiento añadido a la demo. Se borrará al recargar la página.");
  }
  return <DashboardShell demo active={navigation.find(item => item.label === section)!.id} onNavigate={id => { setSection(navigation.find(item => item.id === id)!.label); setNotice(""); }}>
      <div className="content">
        <div className="page-heading"><div>{(section !== "Cuentas" && section !== "Resumen" && section !== "Movimientos") && <div className="eyebrow">TU DINERO, CON PROPÓSITO</div>}<h1>{section === "Resumen" ? "Tu resumen" : section}</h1>{(section !== "Cuentas" && section !== "Resumen" && section !== "Movimientos") && <p>{section === "Planificación" ? "Dale un lugar a cada compromiso antes de que llegue." : section === "Metas y ahorro" ? "Cada aporte te acerca un poco más a lo que quieres." : "Reconoce tus avances cotidianos y suma puntos virtuales."}</p>}</div></div>
        <div className="demo-note">{(section === "Cuentas" || section === "Resumen" || section === "Movimientos") ? "Datos de ejemplo · Los cambios se reinician al recargar." : "Estás explorando datos de ejemplo. Los cambios que hagas aquí solo viven en esta página y se reinician al recargar; nada se guarda en una cuenta ni en una base de datos."}</div>
        <p className="notice" role="status">{notice}</p>
        {section === "Resumen" && <>
          <MonthlySummary currentMonth="2026-11" balance={((income - expense) / 100).toFixed(2)} demo onRegister={() => setFormOpen(true)} onViewMovements={() => setSection("Movimientos")} movements={sharedMovements} />
          <section className="panel summary-next"><div className="panel-heading"><div><h2>Accesos rápidos</h2></div></div><div className="summary-links">{sections.slice(1).map(item => <button className="summary-link" key={item.label} onClick={() => setSection(item.label)}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><span aria-hidden="true">→</span></button>)}</div></section>
        </>}

        {section === "Movimientos" && <MovementsWorkspace demo form={<DemoMovementForm onAdd={addMovement} accounts={accounts} categories={categories} />}><MovementsTable movements={sharedMovements} demo /></MovementsWorkspace>}
        {section === "Cuentas" && <AccountsDemo accounts={accounts} categories={categories} balances={accountTotals.accounts} balance={accountTotals.balance} onAddAccount={name => setAccounts(current => [...current, { id: crypto.randomUUID(), name }])} onAddCategory={(name, kind) => setCategories(current => [...current, { id: crypto.randomUUID(), name, kind }])} />}

        {section === "Planificación" && <div className="two-columns"><section className="panel"><div className="panel-heading"><div><h2>Presupuestos de ejemplo</h2><p>Un límite que te ayuda a decidir</p></div></div>{[{ name: "Alimentación", limit: 80000 }, { name: "Transporte", limit: 25000 }, { name: "Ocio", limit: 20000 }].map(b => { const spent = -movements.filter(m => m.category === b.name && m.amount < 0).reduce((s, m) => s + m.amount, 0); return <div className="budget" key={b.name}><div><strong>{b.name}</strong><span>{money(spent)} / {money(b.limit)}</span></div><progress aria-label={`Presupuesto de ${b.name}`} value={spent} max={Math.max(b.limit, spent)} /><small>{spent > b.limit ? `Exceso: ${money(spent - b.limit)}` : `Quedan ${money(b.limit - spent)}`}</small></div>; })}</section><section className="panel"><div className="panel-heading"><div><h2>Próximos pagos</h2><p>Ejemplos previstos, no descontados del saldo</p></div></div>{[{ day: "15", name: "Internet de casa", amount: 9900 }, { day: "20", name: "Suscripción de música", amount: 2090 }].map(p => <div className="upcoming" key={p.day}><span className="date-tile"><small>NOV</small>{p.day}</span><strong>{p.name}</strong><span>{money(p.amount)}</span></div>)}<p className="panel-foot">La confirmación de pagos está disponible en el espacio privado.</p></section></div>}

        {section === "Metas y ahorro" && <div className="two-columns"><section className="panel"><div className="panel-heading"><div><h2>Un viaje para recordar</h2><p>Meta ilustrativa · A tu propio ritmo</p></div><span className="goal-symbol">☀</span></div><div className="big-number">S/ 480 <small>de S/ 1.200</small></div><progress aria-label="Avance de la meta de viaje" value={40} max={100} /><p className="subtle">Llevas un 40%. Cada aporte te acerca.</p><p className="panel-foot">Esta meta es un ejemplo y no está vinculada a una cuenta de ahorro.</p></section><section className="panel rewards"><span className="eyebrow">UN PASO A LA VEZ</span><h2>El progreso se construye.</h2><p>En la privada puedes crear metas de ahorro y registrar aportes.</p><div className="reward-item"><span>✧</span><div><strong>Tu próximo viaje</strong><small>Ejemplo · 40% completado</small></div></div></section></div>}

        {section === "Hábitos y recompensas" && <HabitsDemo />}

        <footer>Hecho para avanzar a tu ritmo.<span>Vista previa · Datos ficticios</span></footer>
      </div>
    <MovementModal open={formOpen} onClose={() => setFormOpen(false)} demo><DemoMovementForm onAdd={addMovement} accounts={accounts} categories={categories} modal /></MovementModal>
  </DashboardShell>;
}
