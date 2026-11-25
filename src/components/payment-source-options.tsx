import { bankOf } from '@/lib/wallet-order.mjs';

export type PaymentSourceAccount = {
  id: string;
  name: string;
  currency?: string;
  account_type?: string;
  bank_code?: string | null;
};

export default function PaymentSourceOptions({ accounts }: { accounts: PaymentSourceAccount[] }) {
  const groups = new Map<string, PaymentSourceAccount[]>();
  for (const account of accounts) {
    const type = account.account_type === 'credit' ? 'Tarjetas de crédito' : 'Cuentas';
    const label = `${type} · ${bankOf(account)}`;
    const group = groups.get(label);
    if (group) group.push(account);
    else groups.set(label, [account]);
  }

  return [...groups].sort(([first], [second]) => first.localeCompare(second, 'es-PE')).map(([label, members]) => (
    <optgroup key={label} label={label}>
      {members.sort((first, second) => first.name.localeCompare(second.name, 'es-PE')).map(account => {
        const bank = bankOf(account);
        const bankInName = account.name === bank || account.name.startsWith(`${bank} `);
        return <option key={account.id} value={account.id}>{bankInName ? '' : `${bank} · `}{account.name} · {account.currency || 'PEN'}</option>;
      })}
    </optgroup>
  ));
}
