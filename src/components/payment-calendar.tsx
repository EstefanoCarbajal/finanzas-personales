'use client';
import type { PlanningPayment } from './planning-workspace';
import s from './payment-calendar.module.css';

export default function PaymentCalendar({ payments, today, month, selected, onSelect, onMonthChange, disabled = false }: {
  payments: PlanningPayment[]; today: string; month: string; selected: string | null;
  onSelect: (date: string | null) => void; onMonthChange: (month: string, date?: string) => void; disabled?: boolean;
}) {
  const date = new Date(`${month}-01T00:00:00Z`);
  const offset = (date.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth()+1, 0)).getUTCDate();
  const title = new Intl.DateTimeFormat('es-PE',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
  function shift(delta: number) {
    const next = new Date(date);
    next.setUTCMonth(next.getUTCMonth() + delta);
    onMonthChange(next.toISOString().slice(0, 7));
  }
  return <div className={s.calendar}>
    <header><div><span>UN DÍA A LA VEZ</span><h3>{title}</h3></div><div className={s.controls}><button disabled={disabled} onClick={()=>shift(-1)} aria-label="Mes anterior">‹</button><button disabled={disabled} onClick={()=>onMonthChange(today.slice(0, 7), today)}>Hoy</button><button disabled={disabled} onClick={()=>shift(1)} aria-label="Mes siguiente">›</button></div></header>
    <div className={s.week} aria-hidden="true">{['L','M','M','J','V','S','D'].map((day,i)=><span key={i}>{day}</span>)}</div>
    <div className={s.grid}>{Array.from({length:offset},(_,i)=><span key={`blank-${i}`} />)}{Array.from({length:days},(_,i)=>{
      const value = `${month}-${String(i+1).padStart(2,'0')}`;
      const items = payments.filter(p=>p.due_on===value);
      return <button type="button" key={value} disabled={disabled} className={`${s.day} ${items.length ? s.hasPayments : ''} ${selected===value ? s.selected : ''}`} aria-pressed={selected===value} aria-current={value===today?'date':undefined} aria-label={`${value}, ${items.length} pagos pendientes`} onClick={()=>onSelect(selected===value?null:value)}><strong>{i+1}</strong>{items.length>0 && <><span className={s.dots} aria-hidden="true">{items.slice(0,3).map(p=><i key={p.id} />)}</span><small>{items.length} {items.length===1?'pago':'pagos'}</small></>}</button>;
    })}</div>
    <footer><span><i /> Pagos pendientes</span>{selected && <button onClick={()=>onSelect(null)} disabled={disabled}>Ver todo el mes ×</button>}</footer>
  </div>;
}
