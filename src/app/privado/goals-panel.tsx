'use client';

import { useActionState, useEffect, useState } from 'react';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import { addGoal, addGoalContribution } from './actions';

type Account = { id: string; name: string };
type Goal = { id: string; name: string; target_amount: string; saved: string; target_on: string | null; account_id: string; account_name: string };
const initialState = { message: '', success: false };
const dateLabel = (value: string) => new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

function ContributionForm({ goal, accounts }: { goal: Goal; accounts: Account[] }) {
  const [state, action, pending] = useActionState(addGoalContribution, initialState);
  const [requestId, setRequestId] = useState('');
  const [amount, setAmount] = useState('');
  useEffect(() => { setRequestId(crypto.randomUUID()); if (state.success) setAmount(''); }, [state]);
  const sources = accounts.filter(account => account.id !== goal.account_id);
  return <form action={action} className="goal-contribution-form">
    <input type="hidden" name="goal_id" value={goal.id} /><input type="hidden" name="request_id" value={requestId} />
    <label>Aportar a la meta<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="0.00" value={amount} onChange={event => setAmount(event.target.value)} /></label>
    <label>Desde<select name="account_id" required disabled={!sources.length}>{sources.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
    <button className="primary" disabled={pending || !requestId || !sources.length}>{pending ? 'Guardando…' : 'Aportar'}</button>
    <p role="status" className={state.success ? 'goal-message success' : 'goal-message'}>{state.message || `Se transferirá a ${goal.account_name}; no contará como gasto.`}</p>
  </form>;
}

export default function GoalsPanel({ accounts, goals, today }: { accounts: Account[]; goals: Goal[]; today: string }) {
  const [state, action, pending] = useActionState(addGoal, initialState);
  return <section className="panel goals-panel" id="metas">
    <div className="panel-heading"><div><h2>Metas de ahorro</h2><p>Un objetivo, muchos pequeños pasos.</p></div><span className="private-panel-icon goal-panel-icon" aria-hidden="true">✧</span></div>
    <form action={action} className="goal-create-form">
      <label>Nombre de la meta<input name="name" required maxLength={100} placeholder="Ej. Viaje de vacaciones" /></label>
      <div className="form-row"><label>Objetivo (S/)<input name="target_amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="1200.00" /></label><label>Fecha objetivo<input name="target_on" type="date" min={today} /></label></div>
      <div className="form-row"><label>Cuenta de ahorro<select name="account_id" required>{accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label><button className="primary" disabled={pending || !accounts.length}>{pending ? 'Guardando…' : 'Crear meta'}</button></div>
      <p role="status" className={state.success ? 'goal-message success' : 'goal-message'}>{state.message || 'Elige la cuenta que recibirá los aportes de esta meta.'}</p>
    </form>
    <div className="goals-list">{goals.map(goal => {
      const target = toCents(goal.target_amount), saved = toCents(goal.saved);
      const percentage = Number(saved * BigInt(100) / target);
      return <article className="goal-card" key={goal.id}>
        <div className="goal-card-heading"><div><h3>{goal.name}</h3><p>{goal.target_on ? `Meta para el ${dateLabel(goal.target_on)}` : 'A tu propio ritmo'} · Cuenta: {goal.account_name}</p></div><strong>{Math.min(100, percentage)}%</strong></div>
        <div className="goal-amount-line"><strong>{soles(goal.saved)}</strong><span>de {soles(goal.target_amount)}</span></div>
        <progress aria-label={`Avance de ${goal.name}`} value={Math.min(100, Math.max(0, percentage))} max={100} />
        <div className="goal-remaining">{saved >= target ? '¡Meta alcanzada!' : `Faltan ${soles(decimal(target - saved))}`}</div>
        <ContributionForm goal={goal} accounts={accounts} />
      </article>;
    })}{!goals.length && <p className="empty goals-empty">Todavía no tienes metas. Crea la primera para comenzar.</p>}</div>
  </section>;
}
