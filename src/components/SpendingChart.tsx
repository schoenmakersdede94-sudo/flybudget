import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction } from '../types';
import { getCategoryColor } from '../categories';

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

interface Props {
  transactions: Transaction[];
  month: string;
}

export function SpendingChart({ transactions, month }: Props) {
  const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(month));

  const byCategory = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
    return acc;
  }, {});

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-8 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">Nog geen uitgaven om te tonen</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
      <h3 className="font-bold text-sm mb-3">Uitgaven per categorie</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map(entry => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => fmt(Number(value))}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: getCategoryColor(d.name) }} />
              <span className="text-xs flex-1 truncate">{d.name}</span>
              <span className="text-xs font-medium">{fmt(d.value)}</span>
              <span className="text-xs text-[var(--color-text-secondary)] w-10 text-right">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
