import { Trash2 } from 'lucide-react';
import type { Transaction } from '../types';
import { getCategoryColor } from '../categories';

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

interface Props {
  transactions: Transaction[];
  month: string;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, month, onDelete }: Props) {
  const filtered = transactions
    .filter(t => t.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (filtered.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">Nog geen transacties deze maand</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <h3 className="font-bold text-sm">Transacties</h3>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {filtered.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: getCategoryColor(tx.category) }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {tx.description || tx.category}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {tx.category} &middot; {fmtDate(tx.date)}
              </p>
            </div>
            <span
              className="text-sm font-bold whitespace-nowrap"
              style={{ color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)' }}
            >
              {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
            </span>
            <button
              onClick={() => onDelete(tx.id)}
              className="p-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 text-[var(--color-text)]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
