import type { ReactNode } from 'react';
import s from './movements.module.css';

export default function MovementsWorkspace({ children }: { children: ReactNode }) {
  return <div className={s.workspace}>{children}</div>;
}
