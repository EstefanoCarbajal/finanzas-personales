import SelectedAvatar from '@/components/selected-avatar';
import type { ReactNode } from 'react';
import { soles } from '@/lib/money.mjs';
import s from './accounts.module.css';

export type Account = { id: string; name: string };
export type Category = Account & { kind: string };

export function AccountIcon({ name = 'wallet' }: { name?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'plus' ? <path d="M12 5v14M5 12h14" /> : name === 'arrow' ? <path d="m7 17 10-10M7 7h10v10" /> : name === 'income' ? <path d="M17 7 7 17M7 7v10h10" /> : name === 'tag' ? <><path d="m20 13-7 7a2 2 0 0 1-3 0l-7-7V4h9l8 7a1.5 1.5 0 0 1 0 2Z" /><circle cx="7.5" cy="8" r=".7" /></> : <><path d="M4 7V5a2 2 0 0 1 2-2h12v4M4 7h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" /><path d="M21 12h-5v5h5" /><path d="M17.5 14.5h.01" /></>}
  </svg>;
}

function WalletArt() {
  return <div className={s.walletArt} aria-hidden="true"><span className={s.orbit} /><span className={s.artSpark}>✦</span><div className={s.backCard}><i /></div><div className={s.frontCard}><SelectedAvatar width={36} height={36} /><span className={s.cardLines}><i /><i /></span></div><span className={s.artDot} /></div>;
}

export default function AccountsWorkspace({ accounts, categories, balances, balance, accountForm, categoryForm }: {
  accounts: Account[]; categories: Category[]; balances: Record<string, string>; balance: string;
  accountForm: ReactNode; categoryForm: ReactNode;
}) {
  return <div className={s.workspace}>
    <section className={s.hero} aria-labelledby="accounts-balance-title">
      <div className={s.heroCopy}><h2 id="accounts-balance-title">Saldo total</h2><strong className={s.total}>{soles(balance)}</strong></div>
      <WalletArt />
    </section>

    <section aria-labelledby="accounts-list-title">
      <div className={s.sectionHeading}><h2 id="accounts-list-title">Tus cuentas <span className={s.count}>{accounts.length}</span></h2></div>
      {accounts.length ? <div className={s.accountGrid}>{accounts.map((account, index) => {
        const amount = balances[account.id] || '0.00';
        const negative = amount.startsWith('-');
        return <article key={account.id} className={`${s.accountCard} ${s[`tone${index % 3}`]}`}>
          <span className={s.accountIcon}><AccountIcon /></span>
          <div className={s.accountCopy}><h3>{account.name}</h3><strong className={`${s.accountBalance} ${negative ? s.negative : ''}`}>{soles(amount)}</strong></div>
        </article>;
      })}</div> : <div className={s.empty}><AccountIcon /><h3>Añade tu primera cuenta</h3></div>}
      <details className={s.composer}><summary><span className={s.addIcon}><AccountIcon name="plus" /></span><strong>Nueva cuenta</strong><span className={s.chevron} aria-hidden="true">⌄</span></summary><div className={s.composerBody}>{accountForm}</div></details>
    </section>

    <section className={s.categories} aria-labelledby="categories-title">
      <div className={s.sectionHeading}><h2 id="categories-title">Categorías <span className={s.count}>{categories.length}</span></h2></div>
      <div className={s.categoryGroups}>{[{ kind: 'expense', label: 'Gastos', icon: 'arrow' }, { kind: 'income', label: 'Ingresos', icon: 'income' }].map(group => {
        const items = categories.filter(category => category.kind === group.kind);
        return <div className={`${s.categoryGroup} ${group.kind === 'income' ? s.incomeGroup : ''}`} key={group.kind}><h3><AccountIcon name={group.icon} />{group.label}<span>{items.length}</span></h3>{items.length ? <ul className={s.chips}>{items.map(category => <li key={category.id}>{category.name}</li>)}</ul> : <p className={s.emptyCategory}>Sin categorías</p>}</div>;
      })}</div>
      <details className={s.composer}><summary><span className={s.addIcon}><AccountIcon name="plus" /></span><strong>Nueva categoría</strong><span className={s.chevron} aria-hidden="true">⌄</span></summary><div className={s.composerBody}>{categoryForm}</div></details>
    </section>
  </div>;
}
