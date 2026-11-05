import { useState } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { TripManager } from './components/TripManager';
import { AddTransaction } from './components/AddTransaction';
import { TransactionList } from './components/TransactionList';
import { SpendingChart } from './components/SpendingChart';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Transaction, Trip } from './types';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('flybudget-transactions', []);
  const [trips, setTrips] = useLocalStorage<Trip[]>('flybudget-trips', []);
  const [activeTrip, setActiveTrip] = useState<string | null>(null);

  function addTrip(trip: Trip) {
    setTrips(prev => [...prev, trip]);
    setActiveTrip(trip.id);
  }

  function addTransaction(tx: Transaction) {
    setTransactions(prev => [...prev, tx]);
  }

  function deleteTransaction(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function getTripSpent(tripId: string): number {
    return transactions
      .filter(t => t.tripId === tripId && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <StatsCards transactions={transactions} trips={trips} activeTrip={activeTrip} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="space-y-4">
            <TripManager
              trips={trips}
              activeTrip={activeTrip}
              onAdd={addTrip}
              onSelect={setActiveTrip}
              getTripSpent={getTripSpent}
            />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <AddTransaction trips={trips} activeTrip={activeTrip} onAdd={addTransaction} />
            <SpendingChart transactions={transactions} activeTrip={activeTrip} />
            <TransactionList transactions={transactions} trips={trips} activeTrip={activeTrip} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
