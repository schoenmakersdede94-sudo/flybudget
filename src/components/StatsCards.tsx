import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import type { Transaction } from '../types';

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

interface Props {
  transactions: Transaction[];
  month: string;
}

export function StatsCards({ transactions, month }: Props) {
  const monthTx = transactions.filter(t => t.date.startsWith(month));
  const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savings = balance > 0 ? balance : 0;

  const cards = [
    { label: 'Inkomen', value: fmt(income), icon: TrendingUp, color: 'var(--color-success)' },
    { label: 'Uitgaven', value: fmt(expenses), icon: TrendingDown, color: 'var(--color-danger)' },
    { label: 'Balans', value: fmt(balance), icon: Wallet, color: balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' },
    { label: 'Bespaard', value: fmt(savings), icon: PiggyBank, color: 'var(--color-primary)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-2">
            <c.icon className="w-4 h-4" style={{ color: c.color }} />
            <span className="text-xs text-[var(--color-text-secondary)]">{c.label}</span>
          </div>
          <p className="text-lg font-bold" style={{ color: c.color }}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
