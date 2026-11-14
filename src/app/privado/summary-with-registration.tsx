'use client';

import { type ComponentProps } from 'react';
import MonthlySummary from './monthly-summary';
import { useMovementRegistration } from './private-dashboard-shell';

type Props = ComponentProps<typeof MonthlySummary>;

export default function SummaryWithRegistration(summary: Props) {
  const { open, notice } = useMovementRegistration();

  return <>
    <p className="notice" role="status">{notice}</p>
    <MonthlySummary {...summary} onRegister={open} />
  </>;
}
