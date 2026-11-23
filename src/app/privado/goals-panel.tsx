'use client';

import { useActionState, useEffect, useState } from 'react';
import GoalsWorkspace, { SavingsGoalCard, type SavingsGoal } from '@/components/goals-workspace';
import GoalCreateForm from '@/components/goal-create-form';
import s from '@/components/goals-workspace.module.css';
import { changeGoal, addGoal, addGoalContribution } from './actions';

type Account = { id: string; name: string };
const initialState = { message: '', success: false };

function ContributionForm({ goal, accounts }: { goal: SavingsGoal; accounts: Account[] }) {
  const [state, action, pending] = useActionState(addGoalContribution, initialState);
  const [requestId, setRequestId] = useState('');
  const [amount, setAmount] = useState('');
  const sources = accounts.filter(account => account.id !== goal.account_id);
  const [source, setSource] = useState(sources[0]?.id || '');
  useEffect(() => { setRequestId(crypto.randomUUID()); }, []);
  useEffect(() => { if (state.success) { setAmount(''); setRequestId(crypto.randomUUID()); } }, [state]);
  if (!sources.length) return <p className={s.unavailable}>Necesitas otra cuenta para hacer aportes. Puedes crearla en Cuentas.</p>;
  return <details className={s.contribution}>
    <summary onClick={event => { if (pending) event.preventDefault(); }}>+ Aportar <span className={s.srOnly}>a {goal.name}</span></summary>
    <form action={action} className={s.form}>
      <input type="hidden" name="goal_id" value={goal.id} /><input type="hidden" name="request_id" value={requestId} />
      <fieldset disabled={pending}>
        <label>Tu aporte (S/)<input name="amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required placeholder="0.00" maxLength={14} value={amount} onChange={event => setAmount(event.target.value.replace(',', '.'))} /></label>
        <div className={s.fields}><label>Desde<select name="account_id" required value={source} onChange={event => setSource(event.target.value)}>{sources.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label><label>Hacia<input value={goal.account_name} readOnly /></label></div>
        <button className={s.button} disabled={pending || !requestId}>{pending ? 'Guardando…' : 'Confirmar aporte'}</button>
      </fieldset>
      <p className={s.transferNote}>↔ Transferencia entre tus cuentas. No es un gasto.</p>
      <p role="status" className={`${s.message} ${state.success ? s.success : ''}`}>{state.message}</p>
    </form>
  </details>;
}


export default function GoalsPanel({ accounts, goals, today }: { accounts: Account[]; goals: SavingsGoal[]; today: string }) {
  return <GoalsWorkspace goals={goals} creation={<GoalCreateForm accounts={accounts} today={today} saveAction={addGoal} />}>{goals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} manage={changeGoal} today={today}><ContributionForm goal={goal} accounts={accounts} /></SavingsGoalCard>)}</GoalsWorkspace>;
}
