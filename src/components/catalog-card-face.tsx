import { catalogBank } from '@/lib/card-catalog.mjs';
import s from './catalog-card.module.css';

type FaceProps = {
  bank?: string | null; network?: string | null; model?: string | null;
  name?: string; lastFour?: string | null;
};

function finish(model: string) {
  if (/Sapphire/.test(model)) return 'sapphire';
  if (/Iridium|Infinite|Black|Signature/i.test(model)) return 'graphite';
  if (/Platinum/i.test(model)) return 'platinum';
  if (/Oro|Gold/i.test(model)) return 'gold';
  if (/Green/i.test(model)) return 'green';
  return 'classic';
}

export default function CatalogCardFace({ bank, network, model, name, lastFour }: FaceProps) {
  const design = catalogBank(bank)?.design || 'custom';
  return <div className={s.face} data-bank={design} data-finish={finish(model || '')} data-qore={model?.includes('Qore') || undefined}>
    <div className={s.engraving} aria-hidden="true" />
    <div className={s.issuer}>{bank || 'Tarjeta de crédito'}</div>
    <div className={s.hardware} aria-hidden="true">
      <span className={s.chip} />
      <svg viewBox="0 0 20 24" width="17" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 9q2 3 0 6m4-9q4 6 0 12m4-15q6 9 0 18" /></svg>
    </div>
    <div className={s.faceFoot}>
      <div className={s.identity}><strong>{model || name || 'Tu tarjeta'}</strong>
        {lastFour && <span className={s.digits}>•••• {lastFour}</span>}
      </div>
      {network === 'Mastercard'
        ? <span className={s.mastercard} role="img" aria-label="Mastercard" />
        : network && <span className={s.network} data-network={network}>{network === 'Visa' ? 'VISA' : network}</span>}
    </div>
  </div>;
}
