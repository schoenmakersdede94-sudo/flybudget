import { useState } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { MonthPicker } from './components/MonthPicker';
import { AddTransaction } from './components/AddTransaction';
import { TransactionList } from './components/TransactionList';
import { SpendingChart } from './components/SpendingChart';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Transaction } from './types';

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('flybudget-transactions', []);
  const [month, setMonth] = useState(currentMonth);

  function addTransaction(tx: Transaction) {
    setTransactions(prev => [...prev, tx]);
  }

  function deleteTransaction(id: string) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <MonthPicker month={month} onChange={setMonth} />
        <StatsCards transactions={transactions} month={month} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <AddTransaction onAdd={addTransaction} />
            <SpendingChart transactions={transactions} month={month} />
          </div>
          <TransactionList transactions={transactions} month={month} onDelete={deleteTransaction} />
        </div>
      </main>
    </div>
  );
}

export default App;
