'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import { paymentTotals } from '@/lib/payment-totals.mjs';
import palette from './category-color.module.css';
import { categoryIconFor, categoryToneFor } from '@/lib/category-icons.mjs';
import PaymentControls, { type ManagePayment } from './payment-controls';
import BudgetControls, { type ManageBudget } from './budget-controls';
import PaymentCalendar from './payment-calendar';
import CategoryIcon from './category-icon';
import SelectedAvatar from './selected-avatar';
import s from './planning-workspace.module.css';

export type PlanningBudget = { id: string; category_id: string; category_name: string; amount: string; spent: string };
export type PlanningPayment = { account_id?: string; category_id?: string; automatic_at?: string | null; automatic_time?: string | null; currency?: string; id: string; description: string; amount: string; due_on: string; account_name: string; category_name: string };
export type PlanningCategory = { id: string; name: string; kind: string; icon?: string | null };
export type PlanningResult = { success: boolean; message: string };
const paymentMoney = (p: Pick<PlanningPayment, 'amount' | 'currency'>) => p.currency === 'USD' ? soles(p.amount).replace('S/', '$') : soles(p.amount);
const dateLabel = (value: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-PE', { ...options, timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
const daysUntil = (date: string, today: string) => Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
const dueLabel = (days: number) => days < 0 ? `Vencido · ${Math.abs(days)} d` : days === 0 ? 'Vence hoy' : days === 1 ? 'Mañana' : `En ${days} días`;

export default function PlanningWorkspace({ budgets, payments, categories, month, today, budgetForm, paymentForm, processPayment, managePayment, accounts = [], manageBudget, demo = false, section = 'planificacion', goals }: {
  budgets: PlanningBudget[]; payments: PlanningPayment[]; categories: PlanningCategory[]; month: string; today: string;
  managePayment?: ManagePayment; accounts?: { id: string; name: string; currency?: string; account_type?: string }[];
  manageBudget?: ManageBudget;
  budgetForm: ReactNode; paymentForm: ReactNode; demo?: boolean;
  section?: 'planificacion' | 'pagos'; goals?: ReactNode;
  processPayment?: (id: string, mode: 'paid' | 'cancel') => Promise<PlanningResult>;
}) {
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ id: string; mode: 'paid' | 'cancel' } | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<PlanningResult | null>(null);
  const busy = useRef(false);
  const agendaHeading = useRef<HTMLHeadingElement>(null);
  const confirmationBack = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirmation) confirmationBack.current?.focus(); }, [confirmation]);
  const sorted = [...payments].sort((a, b) => a.due_on.localeCompare(b.due_on));
  const overdue = sorted.filter(payment => payment.due_on < today);
  const visible = view === 'calendar' && selectedDate ? sorted.filter(p => p.due_on === selectedDate) : sorted;
  const visibleTotals = paymentTotals(visible);
  const next = sorted[0];

  async function process(id: string, mode: 'paid' | 'cancel') {
    if (!processPayment || busy.current) return;
    busy.current = true;
    setPending(true);
    try {
      const result = await processPayment(id, mode);
      setMessage(result);
      if (result.success) { setConfirmation(null); agendaHeading.current?.focus({ preventScroll: true }); }
    } catch { setMessage({ success: false, message: 'No pudimos completar la acción. Revisa los pagos antes de reintentar.' }); }
    finally { busy.current = false; setPending(false); }
  }

  return <div className={s.workspace} id={section}>
    <header className={s.titleRow}><h1>{section === 'pagos' ? 'Pagos futuros' : 'Planificación'}</h1>{section === 'planificacion' && <span className={s.month}><CalendarIcon />{dateLabel(`${month}-01`, { month: 'long', year: 'numeric' })}</span>}</header>
    {demo && <p className={s.demoNote}>Vista de ejemplo · Noviembre de 2026 · Guardado y confirmación en el espacio privado.</p>}
    {section === 'pagos' && <section className={s.overview} aria-label="Panorama de pagos futuros">
      <div className={s.hero}>
        <div className={s.heroCopy}><span className={s.eyebrow}>PLANIFICA CON CALMA</span><h2>Tu mes,<br />a tu ritmo.</h2>
        </div>
        <div className={s.scene} aria-hidden="true"><span className={s.spark}>✦</span><div className={s.calendar}><div>{dateLabel(today, { month: 'short' })}<span>● ●</span></div><strong>{today.slice(8)}</strong><span className={s.calendarCheck}>✓</span></div><div className={s.avatar}><SelectedAvatar width={116} height={116} /></div><span className={s.orbit}>✧</span></div>
      </div>
      <div className={s.overviewSide}><div className={s.nextPayment}><span className={s.statLabel}>Próximo compromiso</span>{next ? <><strong>{paymentMoney(next)}</strong><span className={s.nextName}>{next.description}</span><span className={next.due_on < today ? s.dangerText : s.nextDate}>{dateLabel(next.due_on, { day: 'numeric', month: 'short' })} · {dueLabel(daysUntil(next.due_on, today))}</span></> : <><strong className={s.allClear}>Todo al día <span aria-hidden="true">✓</span></strong><span className={s.nextName}>Sin pagos pendientes</span></>}</div>
        <div className={s.miniStats}><div><strong>{payments.length}</strong><span>Pendientes</span></div><div><strong className={overdue.length ? s.dangerText : ''}>{overdue.length}</strong><span>Vencidos</span></div></div>
      </div>
    </section>}

    {section === 'planificacion' && <section className={s.budgets} aria-labelledby="budget-heading">
      <header className={s.sectionHeading}><div><span className={s.sectionIcon} aria-hidden="true">◎</span><h2 id="budget-heading" tabIndex={-1}>Tus presupuestos</h2></div>{budgetForm}</header>
      <div className={s.budgetLayout}>
        <div className={s.budgetGrid}>{budgets.map((budget, index) => {
          const limit = toCents(budget.amount), spent = toCents(budget.spent), available = limit - spent;
          const usage = limit > BigInt(0) ? Number(spent * BigInt(100) / limit) : 0;
          const category = categories.find(item => item.id === budget.category_id) || { name: budget.category_name };
          return <article className={`${s.budgetCard} ${spent > limit ? s.overBudget : ''}`} key={budget.id} style={{ '--order': index } as CSSProperties}>
            <div className={s.budgetTop}><span className={`${s.categoryIcon} ${palette.tone}`} data-tone={categoryToneFor(category)}><CategoryIcon id={categoryIconFor(category)} /></span>{(spent > limit || usage >= 80) && <span className={s.budgetStatus}>{spent > limit ? 'Límite superado' : 'Cerca del límite'}</span>}{manageBudget && <BudgetControls budget={budget} manage={manageBudget} demo={demo} />}</div>
            <h3>{budget.category_name}</h3><div className={s.budgetAmount}><strong>{soles(budget.spent)}</strong><span>de {soles(budget.amount)}</span></div>
            <div className={s.track} role="progressbar" aria-label={`Presupuesto de ${budget.category_name}`} aria-valuenow={Math.min(100, usage)} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${usage}% utilizado`}><span style={{ width: `${Math.min(100, Math.max(0, usage))}%` }} /></div>
            <div className={s.budgetFoot}><span>{available < BigInt(0) ? 'Exceso' : 'Disponible'} <b>{soles(decimal(available < BigInt(0) ? -available : available))}</b></span><b>{usage}%</b></div>
          </article>;
        })}{!budgets.length && <div className={s.empty}><span aria-hidden="true">◎</span><h3>Tu primer límite, a tu medida</h3><p>Elige una categoría y cuánto quieres destinarle.</p></div>}</div>
      </div>
    </section>}
    {section === 'planificacion' && goals}

    {section === 'pagos' && <section className={s.agenda} id="agenda-pagos" aria-labelledby="agenda-heading" aria-busy={pending}>
      <header className={s.sectionHeading}><div><span className={s.sectionIcon}><CalendarIcon /></span><h2 id="agenda-heading" tabIndex={-1} ref={agendaHeading}>Pagos futuros</h2><span className={s.count}>{payments.length}</span></div>{paymentForm}</header>
      <div className={s.filters} aria-label="Vista de pagos"><button aria-pressed={view==='calendar'} className={view==='calendar'?s.selectedFilter:''} disabled={pending} onClick={()=>{setView('calendar');setConfirmation(null);}}>▦ Calendario</button><button aria-pressed={view==='list'} className={view==='list'?s.selectedFilter:''} disabled={pending} onClick={()=>{setView('list');setConfirmation(null);}}>☷ Lista</button></div>
      <p role="status" className={`${s.message} ${message?.success ? s.success : ''}`}>{message?.message}</p>
      {view==='calendar' && <PaymentCalendar payments={sorted} today={today} selected={selectedDate} disabled={pending} onSelect={date=>{setSelectedDate(date);setConfirmation(null);}} />}
      {view==='calendar' && selectedDate && <h3>{dateLabel(selectedDate,{day:'numeric',month:'long'})}</h3>}
      <div className={s.paymentList}>{visible.map(payment => {
        const days = daysUntil(payment.due_on, today), confirming = confirmation?.id === payment.id;
        return <article key={payment.id} className={`${s.payment} ${days < 0 ? s.latePayment : ''}`}>
          <div className={s.paymentMain}>{managePayment && <div className={s.paymentControls}><PaymentControls payment={payment} manage={managePayment} accounts={accounts} categories={categories} today={today} demo={demo} /></div>}<time className={s.dateTile} dateTime={payment.due_on}><span>{dateLabel(payment.due_on, { month: 'short' }).replace('.', '')}</span><strong>{payment.due_on.slice(8)}</strong></time><div className={s.paymentCopy}><h3>{payment.description}</h3>{payment.automatic_at && <span className={s.autoBadge}>ϟ Automático · {payment.automatic_time} Lima</span>}<span>{payment.category_name} <i aria-hidden="true">·</i> {payment.account_name}</span></div><div className={s.paymentValue}><strong>{paymentMoney(payment)}</strong><span className={days < 0 ? s.dangerText : ''}>{dueLabel(days)}</span></div></div>
          {processPayment && <div className={s.paymentBottom}>{confirming ? <div className={s.confirmation}><p>{confirmation.mode === 'paid' ? `Se registrará un gasto de ${paymentMoney(payment)} hoy en ${payment.account_name}.` : 'Se retirará este pago pendiente, sin crear un gasto.'}</p><div><button ref={confirmationBack} type="button" className={s.quietButton} disabled={pending} onClick={() => { setConfirmation(null); document.getElementById(`pay-${payment.id}`)?.focus(); }}>Volver</button><button type="button" className={s.button} disabled={pending} onClick={() => process(payment.id, confirmation.mode)}>{pending ? 'Procesando…' : confirmation.mode === 'paid' ? 'Confirmar gasto' : 'Cancelar pago'}</button></div></div> : <><span className={s.paymentHint}>¿Ya lo pagaste?</span><div><button className={s.quietButton} type="button" disabled={pending} onClick={() => { setConfirmation({ id: payment.id, mode: 'cancel' }); setMessage(null); }}>Cancelar pago</button><button id={`pay-${payment.id}`} className={s.payButton} type="button" disabled={pending} onClick={() => { setConfirmation({ id: payment.id, mode: 'paid' }); setMessage(null); }}><span aria-hidden="true">✓</span> Marcar pagado</button></div></>}</div>}
        </article>;
      })}{!visible.length && <div className={s.empty}><span aria-hidden="true">✓</span><h3>{selectedDate && view==='calendar' ? 'Sin pagos para este día' : 'Tu agenda está libre'}</h3><p>Añade tu próximo pago para tenerlo presente.</p></div>}</div>
      {visible.length > 0 && <div className={s.paymentTotal}><span>{view === 'calendar' && selectedDate ? 'Total del día' : 'Total pendiente'}</span><div>{visibleTotals.map(total => <strong key={total.currency}>{paymentMoney(total)}</strong>)}</div></div>}
    </section>}
  </div>;
}

function CalendarIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="4" /><path d="M7 3v4m10-4v4M3 11h18m-14 5h3m4 0h3" /></svg>; }
