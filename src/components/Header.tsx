import { Plane } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-4 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">FlyBudget</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">Beheer je reisbudget per vlucht</p>
        </div>
      </div>
    </header>
  );
}
