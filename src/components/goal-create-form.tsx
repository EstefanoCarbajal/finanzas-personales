'use client';

import { useActionState, useEffect, useState } from 'react';
import VacationAvatar from './vacation-avatar';
import { decimal, soles, toCents } from '@/lib/money.mjs';
import s from './goal-create-form.module.css';

type Result = { message: string; success: boolean };
type Props = { accounts: { id: string; name: string }[]; today: string; saveAction?: (state: Result, form: FormData) => Promise<Result> };
const ideas = [
  { name: 'Mi próximo viaje', icon: '✈', label: 'Viaje' },
  { name: 'Mi fondo de tranquilidad', icon: '☂', label: 'Tranquilidad' },
  { name: 'Mi nuevo equipo', icon: '⌘', label: 'Tecnología' },
];
const previewAction = async () => ({ message: 'La creación de metas está disponible en tu espacio privado.', success: false });


export default function GoalCreateForm({ accounts, today, saveAction }: Props) {
  const [state, action, pending] = useActionState(saveAction || previewAction, { message: '', success: false });
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [account, setAccount] = useState(accounts[0]?.id || '');
  const [idea, setIdea] = useState(-1);
  useEffect(() => { if (state.success) { setName(''); setAmount(''); setIdea(-1); } }, [state]);
  let amountLabel = 'S/ —';
  try { const cents = toCents(amount); if (cents > BigInt(0)) amountLabel = soles(decimal(cents)); } catch { /* El campo conserva la entrada para poder corregirla. */ }
  const selectedAccount = accounts.find(item => item.id === account)?.name;
  return <details className={s.creator}>
    <summary onClick={event => { if (pending) event.preventDefault(); }}><span className={s.plus} aria-hidden="true">+</span><span>Nueva meta</span></summary>
    <form action={action} className={s.layout} aria-label="Crear una meta de ahorro" aria-busy={pending}>
      <fieldset disabled={pending || !accounts.length} className={s.editor}>
        <label className={s.label}>¿Qué quieres lograr?<input name="name" required maxLength={100} placeholder="Ej. Mi próximo viaje" value={name} onChange={event => { setName(event.target.value); setIdea(-1); }} /></label>
        <div className={s.ideas} aria-label="Ideas para tu meta">{ideas.map((item, index) => <button type="button" key={item.label} aria-pressed={idea === index} className={idea === index ? s.selected : ''} onClick={() => { setIdea(index); setName(item.name); }}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</div>
        <label className={s.label} htmlFor="goal-target-amount">¿Cuánto quieres reunir?</label>
        <div className={s.amountField}><span aria-hidden="true">S/</span><input id="goal-target-amount" aria-label="Objetivo en soles" name="target_amount" type="text" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required maxLength={14} placeholder="0.00" value={amount} onChange={event => setAmount(event.target.value.replace(',', '.'))} /></div>
        <div className={s.quickAmounts} aria-label="Importes sugeridos">{['500', '1200', '3000'].map(value => <button key={value} type="button" aria-pressed={amount === value} onClick={() => setAmount(value)}>S/ {value}</button>)}</div>
        <div className={s.fieldPair}><label className={s.label}>Cuenta de ahorro<select name="account_id" required value={account} onChange={event => setAccount(event.target.value)}>{accounts.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className={`${s.label} ${s.date}`}>Fecha <small>· opcional</small><input name="target_on" type="date" min={today} value={date} onChange={event => setDate(event.target.value)} /></label></div>
        <button className={s.submit} disabled={pending || !accounts.length || !saveAction}>{pending ? 'Creando tu meta…' : saveAction ? 'Crear mi meta' : 'Creación disponible en privado'}<span aria-hidden="true">{pending ? '◌' : '→'}</span></button>
      </fieldset>
      <aside className={s.preview} aria-label="Vista previa de tu nueva meta"><span className={s.previewTag}>TU PRÓXIMA META</span><VacationAvatar className={s.illustration} /><h3>{name.trim() || 'Tu próximo gran logro'}</h3><span className={s.previewCaption}>Quiero reunir</span><strong className={s.previewAmount}>{amountLabel}</strong><div className={s.previewAccount}><span aria-hidden="true">↳</span> {selectedAccount || 'Elige tu cuenta de ahorro'}</div></aside>
      <div className={s.feedback}>{!accounts.length && <p>Primero crea una cuenta en Cuentas para recibir tus aportes.</p>}<p role="status" className={state.success ? s.success : s.error}>{state.success && <span aria-hidden="true">✦ </span>}{state.message}</p>{!saveAction && <p>Vista previa interactiva · no se guarda.</p>}</div>
    </form>
  </details>;
}
