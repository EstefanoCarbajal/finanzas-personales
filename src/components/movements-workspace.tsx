'use client';

import SelectedAvatar from '@/components/selected-avatar';
import type { ReactNode } from 'react';
import s from './movements.module.css';

export default function MovementsWorkspace({ children, form }: { children: ReactNode; form: ReactNode; demo?: boolean }) {
  return <div className={s.workspace}>
    <section className={s.composer} id="movement-entry" aria-labelledby="entry-title" tabIndex={-1}>
      <div className={s.composerHeading}>
        <div><h2 id="entry-title">Anota tu movimiento</h2></div>
        <div className={s.composerMascot} aria-hidden="true"><span>✦</span><SelectedAvatar /></div>
      </div>
      {form}
    </section>
    {children}
  </div>;
}
