import type { CategoryConfig } from './types';

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { name: 'Vliegtickets', icon: 'Plane', color: '#6366f1' },
  { name: 'Hotel', icon: 'Hotel', color: '#3b82f6' },
  { name: 'Autohuur', icon: 'Car', color: '#f59e0b' },
  { name: 'Transport', icon: 'Train', color: '#14b8a6' },
  { name: 'Eten & Drinken', icon: 'UtensilsCrossed', color: '#ef4444' },
  { name: 'Activiteiten', icon: 'Ticket', color: '#a855f7' },
  { name: 'Verzekering', icon: 'Shield', color: '#22c55e' },
  { name: 'Bagage', icon: 'Luggage', color: '#f97316' },
  { name: 'Visum & Docs', icon: 'FileText', color: '#ec4899' },
  { name: 'Overig', icon: 'MoreHorizontal', color: '#64748b' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { name: 'Reisbudget', icon: 'Wallet', color: '#22c55e' },
  { name: 'Terugbetaling', icon: 'RefreshCw', color: '#3b82f6' },
  { name: 'Cadeau', icon: 'Gift', color: '#ec4899' },
  { name: 'Overig', icon: 'MoreHorizontal', color: '#64748b' },
];

export function getCategoryColor(name: string): string {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return all.find(c => c.name === name)?.color ?? '#64748b';
}
