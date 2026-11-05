import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../categories';

interface Props {
  onAdd: (tx: Transaction) => void;
}

export function AddTransaction({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !category) return;
    onAdd({
      id: uuidv4(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });
    setAmount('');
    setCategory('');
    setDescription('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 cursor-pointer border-0"
        style={{ background: 'var(--color-primary)' }}
      >
        <Plus className="w-5 h-5" /> Transactie toevoegen
      </button>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base">Nieuwe transactie</h3>
        <button onClick={() => setOpen(false)} className="p-1 cursor-pointer bg-transparent border-0 text-[var(--color-text)]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['expense', 'income'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setType(t); setCategory(''); }}
            className="flex-1 py-2 rounded-lg font-medium text-sm cursor-pointer border-0"
            style={{
              background: type === t ? (t === 'expense' ? 'var(--color-danger)' : 'var(--color-success)') : 'var(--color-surface-alt)',
              color: type === t ? '#fff' : 'var(--color-text)',
            }}
          >
            {t === 'expense' ? 'Uitgave' : 'Inkomen'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Bedrag (€)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm"
        >
          <option value="">Kies categorie...</option>
          {categories.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Beschrijving (optioneel)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm"
        />

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm"
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-semibold text-white cursor-pointer border-0"
          style={{ background: type === 'expense' ? 'var(--color-danger)' : 'var(--color-success)' }}
        >
          {type === 'expense' ? 'Uitgave' : 'Inkomen'} opslaan
        </button>
      </form>
    </div>
  );
}
