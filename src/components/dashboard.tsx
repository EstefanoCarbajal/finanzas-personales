"use client";

import { useState } from "react";

type Section = "Resumen" | "Movimientos" | "Planificación" | "Metas y premios";
type Movement = { id: number; name: string; category: string; amount: number; date: string };
const initial: Movement[] = [
  { id: 1, name: "Compra de la semana", category: "Alimentación", amount: -18650, date: "2026-11-10" },
  { id: 2, name: "Taxi a la oficina", category: "Transporte", amount: -1850, date: "2026-11-09" },
  { id: 3, name: "Café con amigos", category: "Ocio", amount: -3200, date: "2026-11-08" },
  { id: 4, name: "Ingreso mensual", category: "Ingresos", amount: 420000, date: "2026-11-01" },
];
const money = (cents: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(cents / 100);
const categories = ["Alimentación", "Transporte", "Vivienda", "Ocio", "Salud", "Otros"];
const nav: { label: Section; icon: string }[] = [{ label: "Resumen", icon: "◫" }, { label: "Movimientos", icon: "↔" }, { label: "Planificación", icon: "▦" }, { label: "Metas y premios", icon: "◇" }];

export default function Dashboard() {
  const [section, setSection] = useState<Section>("Resumen");
  const [movements, setMovements] = useState(initial);
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState("");
  const income = movements.filter(m => m.amount > 0).reduce((a, m) => a + m.amount, 0);
  const expense = -movements.filter(m => m.amount < 0).reduce((a, m) => a + m.amount, 0);
  const filtered = movements.filter(m => `${m.name} ${m.category}`.toLowerCase().includes(filter.toLowerCase()));

  function addMovement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = String(data.get("amount"));
    const parts = value.split(".");
    const cents = Number(parts[0]) * 100 + Number((parts[1] || "").padEnd(2, "0"));
    const name = String(data.get("name")).trim();
    if (!name || !Number.isSafeInteger(cents) || cents <= 0 || cents > 999999999) return;
    const isIncome = data.get("type") === "income";
    setMovements(current => [{ id: Date.now(), name, amount: isIncome ? cents : -cents, category: isIncome ? "Ingresos" : String(data.get("category")), date: String(data.get("date")) }, ...current]);
    setFormOpen(false);
    setNotice("Movimiento añadido a la demo. Se borrará al recargar la página.");
  }

  function exportDemo() {
    const rows = [["Fecha", "Descripción", "Categoría", "Importe PEN"], ...movements.map(m => [m.date, m.name, m.category, (m.amount / 100).toFixed(2)])];
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/^[=+@\-]/, "'$&").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "movimientos-demo.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="Finanzas personales, inicio"><span className="brand-mark">f.</span><span>finanzas<span className="brand-sub">PERSONALES</span></span></a>
      <div className="workspace-label">TU ESPACIO PERSONAL</div>
      <nav aria-label="Navegación principal">{nav.map(item => <button key={item.label} aria-current={section === item.label ? "page" : undefined} className={section === item.label ? "nav-item active" : "nav-item"} onClick={() => { setSection(item.label); setFilter(""); }}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-tip"><span className="tip-icon">✧</span><h3>Pequeños pasos.<br />Grandes metas.</h3><p>Un poco de claridad hoy, más tranquilidad mañana.</p></div>
      <div className="profile"><span className="avatar">E</span><div><strong>Mi espacio</strong><small>Vista de demostración</small></div><span className="profile-dot" /></div>
    </aside>
    <main>
      <header className="topbar"><span>Mi espacio <span className="breadcrumb">/ {section}</span></span><span className="demo-badge">DEMO · SIN DATOS REALES</span></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">TU DINERO, CON PROPÓSITO</div><h1>{section === "Resumen" ? "Cada paso cuenta." : section}</h1><p>{section === "Resumen" ? "Una mirada clara a tu mes y a lo que quieres conseguir." : section === "Movimientos" ? "Conoce a dónde va tu dinero, movimiento a movimiento." : section === "Planificación" ? "Dale un lugar a cada compromiso antes de que llegue." : "Convierte tus buenos hábitos en avances que se sienten."}</p></div><button className="primary" onClick={() => setFormOpen(true)}><span aria-hidden="true">＋</span> Registrar movimiento</button></div>
        <div className="demo-note">Estás explorando un ejemplo de noviembre de 2026. Puedes probar el registro y los filtros; los cambios se reinician al recargar. MySQL y el acceso privado aún no están conectados.</div>
        <p className="notice" role="status">{notice}</p>
        {(section === "Resumen" || section === "Movimientos") && <>
          <div className="section-bar"><h2>{section === "Resumen" ? "Tu mes, en un vistazo" : "Balance del ejemplo"}</h2><span className="month-pill">Noviembre 2026</span></div>
          <div className="stats"><article className="stat balance"><span>Saldo del ejemplo <span aria-hidden="true">↗</span></span><strong>{money(income - expense)}</strong><small>Ingresos menos gastos registrados</small></article><article className="stat"><span>Ingresos <b className="mini-icon green">↓</b></span><strong>{money(income)}</strong><small>Entradas de dinero del mes</small></article><article className="stat"><span>Gastos <b className="mini-icon orange">↑</b></span><strong>{money(expense)}</strong><small>{movements.filter(m => m.amount < 0).length} movimientos registrados</small></article></div>
        </>}
        {section === "Resumen" && <div className="two-columns"><section className="panel"><div className="panel-heading"><div><h2>¿En qué estás gastando?</h2><p>Distribución por categoría</p></div><span className="subtle">Este mes</span></div><div className="category-list">{categories.map((category, i) => { const total = -movements.filter(m => m.category === category && m.amount < 0).reduce((a, m) => a + m.amount, 0); if (!total) return null; return <div className="category" key={category}><div><span><i style={{ background: ["#548476", "#bca06e", "#8099af", "#c78d7a", "#9c92b1", "#9ba8a1"][i] }} />{category}</span><strong>{money(total)}</strong></div><div className="track"><div style={{ width: `${total / expense * 100}%`, background: ["#548476", "#bca06e", "#8099af", "#c78d7a", "#9c92b1", "#9ba8a1"][i] }} /></div></div>; })}</div><p className="panel-foot">La claridad empieza por saber dónde estás.</p></section><section className="goal-feature"><div className="goal-top"><span className="eyebrow">UNA META A LA VEZ</span><span className="goal-symbol">☀</span></div><h2>Tu próximo viaje<br />está más cerca.</h2><p>Ejemplo de una meta de ahorro personal.</p><div className="goal-amount"><strong>S/ 480</strong><span>de S/ 1.200</span></div><div className="track"><div style={{ width: "40%" }} /></div><div className="goal-bottom"><span>40% del camino</span><button onClick={() => setSection("Metas y premios")}>Ver meta →</button></div></section></div>}
        {(section === "Resumen" || section === "Movimientos") && <section className="panel movements"><div className="panel-heading"><div><h2>{section === "Resumen" ? "Últimos movimientos" : "Tus movimientos"}</h2><p>Los detalles también cuentan</p></div><button className="secondary" onClick={exportDemo}>Exportar ejemplo ↓</button></div>{section === "Movimientos" && <label className="search">Buscar movimientos<input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Descripción o categoría" /></label>}<div className="table-wrap"><table><thead><tr><th>Movimiento</th><th>Categoría</th><th>Fecha</th><th className="amount">Importe</th></tr></thead><tbody>{filtered.map(m => <tr key={m.id}><td><span className={`transaction-icon ${m.amount > 0 ? "income" : ""}`} aria-hidden="true">{m.amount > 0 ? "↓" : "↗"}</span><strong>{m.name}</strong></td><td><span className="category-tag">{m.category}</span></td><td className="subtle">{m.date.split("-").reverse().join("/")}</td><td className={`amount ${m.amount > 0 ? "positive" : ""}`}>{m.amount > 0 ? "+" : "−"}{money(Math.abs(m.amount))}</td></tr>)}</tbody></table>{filtered.length === 0 && <p className="empty">No hay movimientos que coincidan con tu búsqueda.</p>}</div>{section === "Resumen" && <button className="text-button" onClick={() => setSection("Movimientos")}>Ver todos los movimientos →</button>}</section>}
        {section === "Planificación" && <div className="two-columns"><section className="panel"><div className="panel-heading"><div><h2>Presupuestos de ejemplo</h2><p>Un límite que te ayuda a decidir</p></div></div>{[{ name: "Alimentación", limit: 80000 }, { name: "Transporte", limit: 25000 }, { name: "Ocio", limit: 20000 }].map(b => { const spent = -movements.filter(m => m.category === b.name && m.amount < 0).reduce((s, m) => s + m.amount, 0); return <div className="budget" key={b.name}><div><strong>{b.name}</strong><span>{money(spent)} / {money(b.limit)}</span></div><progress aria-label={`Presupuesto de ${b.name}`} value={spent} max={Math.max(b.limit, spent)} /><small>{spent > b.limit ? `Exceso: ${money(spent - b.limit)}` : `Quedan ${money(b.limit - spent)}`}</small></div>; })}</section><section className="panel"><div className="panel-heading"><div><h2>Próximos pagos</h2><p>Ejemplos previstos, no descontados del saldo</p></div></div>{[{ day: "15", name: "Internet de casa", amount: 9900 }, { day: "20", name: "Suscripción de música", amount: 2090 }].map(p => <div className="upcoming" key={p.day}><span className="date-tile"><small>NOV</small>{p.day}</span><strong>{p.name}</strong><span>{money(p.amount)}</span></div>)}<p className="panel-foot">La confirmación de pagos estará disponible al conectar la base de datos.</p></section></div>}
        {section === "Metas y premios" && <div className="two-columns"><section className="panel"><div className="panel-heading"><div><h2>Un viaje para recordar</h2><p>Meta ilustrativa · A tu propio ritmo</p></div><span className="goal-symbol">☀</span></div><div className="big-number">S/ 480 <small>de S/ 1.200</small></div><progress aria-label="Avance de la meta de viaje" value={40} max={100} /><p className="subtle">Llevas un 40%. Cada aporte te acerca.</p><p className="panel-foot">El registro de aportes se implementará con MySQL.</p></section><section className="panel rewards"><span className="eyebrow">HÁBITOS QUE SUMAN</span><h2>Tu constancia tiene valor.</h2><p>Revisa tus movimientos una vez por semana y gana 20 puntos virtuales.</p><div className="reward-item"><span>✧</span><div><strong>Una tarde de películas</strong><small>Ejemplo de premio personal · 60 puntos</small></div></div><p className="panel-foot">Los puntos y canjes aún no están activos. No representan dinero.</p></section></div>}
        <footer>Hecho para avanzar a tu ritmo.<span>Primera entrega · Vista previa</span></footer>
      </div>
    </main>
    {formOpen && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" onKeyDown={e => { if (e.key === "Escape") setFormOpen(false); if (e.key === "Tab") { const nodes = e.currentTarget.querySelectorAll<HTMLElement>("button, input, select"); const first = nodes[0]; const last = nodes[nodes.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}><div className="panel-heading"><h2 id="form-title">Prueba un movimiento</h2><button className="close" aria-label="Cerrar formulario" onClick={() => setFormOpen(false)}>×</button></div><p>Solo para explorar la demo. No introduzcas datos reales.</p><form onSubmit={addMovement}><label>Descripción<input autoFocus required maxLength={100} name="name" placeholder="Por ejemplo, almuerzo" /></label><div className="form-row"><label>Tipo<select name="type"><option value="expense">Gasto</option><option value="income">Ingreso</option></select></label><label>Importe (S/)<input required type="number" min="0.01" max="9999999.99" step="0.01" name="amount" placeholder="0.00" /></label></div><div className="form-row"><label>Categoría<select name="category">{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Fecha del ejemplo<input required type="date" name="date" defaultValue="2026-11-10" min="2026-11-01" max="2026-11-30" /></label></div><button className="primary" type="submit">Añadir a la demo</button></form></section></div>}
  </div>;
}
