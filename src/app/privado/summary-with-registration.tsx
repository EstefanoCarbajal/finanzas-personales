'use client';

import { useCallback, useState, type ComponentProps } from 'react';
import MonthlySummary from './monthly-summary';
import MovementForm from './movement-form';
import MovementModal from '@/components/movement-modal';

type Props = ComponentProps<typeof MonthlySummary> & Pick<ComponentProps<typeof MovementForm>, 'accounts' | 'categories' | 'today' | 'requestId'>;

export default function SummaryWithRegistration({ accounts, categories, today, requestId, ...summary }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const saved = useCallback(() => { setOpen(false); setNotice('✓ Movimiento guardado'); }, []);

  return <>
    <p className="notice" role="status">{notice}</p>
    <MonthlySummary {...summary} onRegister={() => { setNotice(''); setOpen(true); }} />
    <MovementModal open={open} onClose={() => setOpen(false)} pending={pending}>
      <MovementForm accounts={accounts} categories={categories} today={today} requestId={requestId} modal onSuccess={saved} onPendingChange={setPending} />
    </MovementModal>
  </>;
}
