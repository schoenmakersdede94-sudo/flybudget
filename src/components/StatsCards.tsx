import { Plane, TrendingDown, Wallet, Target } from 'lucide-react';
import type { Transaction, Trip } from '../types';

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

interface Props {
  transactions: Transaction[];
  trips: Trip[];
  activeTrip: string | null;
}

export function StatsCards({ transactions, trips, activeTrip }: Props) {
  const filtered = activeTrip
    ? transactions.filter(t => t.tripId === activeTrip)
    : transactions;

  const budget = activeTrip
    ? (trips.find(t => t.id === activeTrip)?.budget ?? 0)
    : trips.reduce((s, t) => s + t.budget, 0);

  const spent = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const remaining = budget - spent + income;

  const tripCount = activeTrip ? 1 : trips.length;

  const cards = [
    { label: 'Reizen', value: String(tripCount), icon: Plane, color: 'var(--color-primary)' },
    { label: 'Uitgegeven', value: fmt(spent), icon: TrendingDown, color: 'var(--color-danger)' },
    { label: 'Budget', value: fmt(budget), icon: Target, color: 'var(--color-warning)' },
    { label: 'Resterend', value: fmt(remaining), icon: Wallet, color: remaining >= 0 ? 'var(--color-success)' : 'var(--color-danger)' },
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
