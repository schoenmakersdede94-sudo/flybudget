import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  month: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ month, onChange }: Props) {
  const [year, m] = month.split('-').map(Number);

  function shift(delta: number) {
    const d = new Date(year, m - 1 + delta, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const label = new Date(year, m - 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => shift(-1)}
        className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] cursor-pointer bg-transparent border-0 text-[var(--color-text)]"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-semibold capitalize w-40 text-center">{label}</span>
      <button
        onClick={() => shift(1)}
        className="p-2 rounded-lg hover:bg-[var(--color-surface-alt)] cursor-pointer bg-transparent border-0 text-[var(--color-text)]"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
