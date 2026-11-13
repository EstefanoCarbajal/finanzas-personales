'use client';

import SelectedAvatar from '@/components/selected-avatar';
import type { ReactNode } from 'react';
import s from './movements.module.css';

export default function MovementsWorkspace({ children, form, demo = false }: { children: ReactNode; form: ReactNode; demo?: boolean }) {
  return <div className={s.workspace}>
    <section className={s.composer} id="movement-entry" aria-labelledby="entry-title" tabIndex={-1}>
      <div className={s.composerHeading}>
        <div><span className={s.eyebrow}>UN PASO MÁS DE CLARIDAD</span><h2 id="entry-title">Anota tu movimiento</h2><p>{demo ? 'Prueba con datos ficticios. Todo se reinicia al recargar.' : 'Lo que entra, lo que sale y lo que mueves entre tus cuentas.'}</p></div>
        <div className={s.composerMascot} aria-hidden="true"><span>✦</span><SelectedAvatar /></div>
      </div>
      {form}
      <div className={s.composerTip}><span aria-hidden="true">✧</span><p>Transferir entre tus cuentas mueve tu dinero, pero no suma ingresos ni gastos.</p></div>
    </section>
    {children}
  </div>;
}
