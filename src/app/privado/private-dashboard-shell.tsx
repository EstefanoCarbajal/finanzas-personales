'use client';

import { createContext, useCallback, useContext, useState, type ComponentProps } from 'react';
import DashboardShell from '@/components/dashboard-shell';
import MovementModal from '@/components/movement-modal';
import MovementForm from './movement-form';

const RegistrationContext = createContext<{ open: () => void; notice: string } | null>(null);

export function useMovementRegistration() {
  const registration = useContext(RegistrationContext);
  if (!registration) throw new Error('Movement registration requires the private dashboard shell.');
  return registration;
}

type Props = Omit<ComponentProps<typeof DashboardShell>, 'onNewMovement'> & Pick<ComponentProps<typeof MovementForm>, 'accounts' | 'categories' | 'today' | 'requestId'>;

export default function PrivateDashboardShell({ accounts, categories, today, requestId, children, ...shell }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const openForm = useCallback(() => { setNotice(''); setOpen(true); }, []);
  const saved = useCallback(() => { setOpen(false); setNotice('✓ Movimiento guardado'); }, []);

  return <RegistrationContext.Provider value={{ open: openForm, notice }}>
    <DashboardShell {...shell} onNewMovement={openForm}>
      {children}
      <MovementModal open={open} onClose={() => setOpen(false)} pending={pending}>
        <MovementForm accounts={accounts} categories={categories} today={today} requestId={requestId} modal onSuccess={saved} onPendingChange={setPending} />
      </MovementModal>
    </DashboardShell>
  </RegistrationContext.Provider>;
}
