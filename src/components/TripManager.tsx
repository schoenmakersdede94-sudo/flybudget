import { useState } from 'react';
import { Plus, X, MapPin, Calendar, Plane } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Trip } from '../types';

interface Props {
  trips: Trip[];
  activeTrip: string | null;
  onAdd: (trip: Trip) => void;
  onSelect: (id: string | null) => void;
  getTripSpent: (tripId: string) => number;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

export function TripManager({ trips, activeTrip, onAdd, onSelect, getTripSpent }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !destination || !budget) return;
    onAdd({
      id: uuidv4(),
      name,
      destination,
      startDate,
      endDate,
      budget: parseFloat(budget),
    });
    setName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setBudget('');
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">Mijn Reizen</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer border-0"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          {adding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {adding ? 'Annuleer' : 'Nieuwe reis'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 space-y-3">
          <input type="text" placeholder="Reisnaam (bijv. Vakantie Bali)" value={name} onChange={e => setName(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm" />
          <input type="text" placeholder="Bestemming" value={destination} onChange={e => setDestination(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" placeholder="Vertrekdatum" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm" />
            <input type="date" placeholder="Terugkomst" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm" />
          </div>
          <input type="number" step="0.01" min="1" placeholder="Budget (€)" value={budget} onChange={e => setBudget(e.target.value)} required
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] text-sm" />
          <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white cursor-pointer border-0" style={{ background: 'var(--color-primary)' }}>
            Reis toevoegen
          </button>
        </form>
      )}

      <button
        onClick={() => onSelect(null)}
        className="w-full text-left px-4 py-3 rounded-xl border cursor-pointer text-sm font-medium"
        style={{
          background: activeTrip === null ? 'var(--color-primary)' : 'var(--color-surface)',
          color: activeTrip === null ? '#fff' : 'var(--color-text)',
          borderColor: activeTrip === null ? 'var(--color-primary)' : 'var(--color-border)',
        }}
      >
        Alle reizen
      </button>

      {trips.map(trip => {
        const spent = getTripSpent(trip.id);
        const pct = trip.budget > 0 ? Math.min((spent / trip.budget) * 100, 100) : 0;
        const overBudget = spent > trip.budget;

        return (
          <button
            key={trip.id}
            onClick={() => onSelect(trip.id)}
            className="w-full text-left px-4 py-3 rounded-xl border cursor-pointer"
            style={{
              background: activeTrip === trip.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeTrip === trip.id ? '#fff' : 'var(--color-text)',
              borderColor: activeTrip === trip.id ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-3.5 h-3.5" />
              <span className="text-sm font-bold truncate">{trip.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-80 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{trip.destination}</span>
              {trip.startDate && (
                <>
                  <Calendar className="w-3 h-3 ml-1" />
                  <span>{new Date(trip.startDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                </>
              )}
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: activeTrip === trip.id ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-alt)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: overBudget ? 'var(--color-danger)' : 'var(--color-success)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 opacity-80">
              <span>{fmt(spent)} uitgegeven</span>
              <span>{fmt(trip.budget)} budget</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
