'use client';

import { useState, type ReactNode } from 'react';
import { cardCatalog, catalogBank, modelsFor } from '@/lib/card-catalog.mjs';
import CatalogCardFace from './catalog-card-face';
import s from './catalog-card.module.css';

export default function CardCatalogPicker({ children, lastFour }: { children?: ReactNode; lastFour?: string }) {
  const [bank, setBank] = useState('');
  const [network, setNetwork] = useState('');
  const [model, setModel] = useState('');
  const [otherBank, setOtherBank] = useState('');
  const [otherNetwork, setOtherNetwork] = useState('');
  const [name, setName] = useState('');
  const issuer = catalogBank(bank);
  const networks = issuer?.networks.map(entry => entry.network) ?? ['Visa', 'Mastercard', 'American Express', 'Diners Club'];
  const models = modelsFor(bank, network);
  const bankReady = bank && (bank !== 'other' || otherBank.trim());
  const networkReady = bankReady && network && (network !== 'other' || otherNetwork.trim());
  const ready = networkReady && model && (model !== 'other' || name.trim());

  return <div className={s.picker}>
    <div className={s.preview} aria-label="Vista previa de la tarjeta">
      <CatalogCardFace bank={bank === 'other' ? otherBank : bank} network={network === 'other' ? otherNetwork : network}
        model={model === 'other' ? '' : model} name={model === 'other' ? name : ''} lastFour={lastFour?.length === 4 ? lastFour : undefined} />
    </div>
    <div className={s.selectors}>
      <label>Banco<select name="bank_code" value={bank} required onChange={e => {
        setBank(e.target.value); setNetwork(''); setModel(''); setOtherBank(''); setOtherNetwork(''); setName('');
      }}>
        <option value="" disabled>Elige tu banco</option>
        {cardCatalog.map(bank => <option key={bank.bank}>{bank.bank}</option>)}
        <option value="other">Otros</option>
      </select></label>
      {bank === 'other' && <label>Nombre del banco<input name="other_bank" maxLength={24} required value={otherBank} onChange={e => setOtherBank(e.target.value)} /></label>}
      {bankReady && <label>Red<select name="network" value={network} required onChange={e => {
        setNetwork(e.target.value); setModel(''); setOtherNetwork(''); setName('');
      }}>
        <option value="" disabled>Elige la red</option>
        {networks.map(red => <option key={red}>{red}</option>)}
        <option value="other">Otra red</option>
      </select></label>}
      {bankReady && network === 'other' && <label>Nombre de la red<input name="other_network" maxLength={32} required value={otherNetwork} onChange={e => setOtherNetwork(e.target.value)} /></label>}
    </div>
    {networkReady && <label>Modelo<select name="catalog_model" value={model} required onChange={e => { setModel(e.target.value); setName(''); }}>
      <option value="" disabled>Elige tu tarjeta</option>
      {models.map(product => <option key={product}>{product}</option>)}
      <option value="other">Otros</option>
    </select></label>}
    {networkReady && model === 'other' && <label>Nombre de la tarjeta<input name="name" maxLength={80} required placeholder="Como aparece en tu tarjeta" value={name} onChange={e => setName(e.target.value)} /></label>}
    {!networkReady && <input type="hidden" name="catalog_model" value="" />}
    {children && <div hidden={!ready}><fieldset disabled={!ready} className={s.details}>{children}</fieldset></div>}
  </div>;
}
