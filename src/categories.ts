import type { CategoryConfig } from './types';

export const EXPENSE_CATEGORIES: CategoryConfig[] = [
  { name: 'Boodschappen', icon: 'ShoppingCart', color: '#22c55e' },
  { name: 'Wonen', icon: 'Home', color: '#6366f1' },
  { name: 'Transport', icon: 'Car', color: '#f59e0b' },
  { name: 'Eten & Drinken', icon: 'UtensilsCrossed', color: '#ef4444' },
  { name: 'Entertainment', icon: 'Tv', color: '#a855f7' },
  { name: 'Gezondheid', icon: 'Heart', color: '#ec4899' },
  { name: 'Kleding', icon: 'Shirt', color: '#14b8a6' },
  { name: 'Abonnementen', icon: 'Repeat', color: '#f97316' },
  { name: 'Sparen', icon: 'PiggyBank', color: '#3b82f6' },
  { name: 'Overig', icon: 'MoreHorizontal', color: '#64748b' },
];

export const INCOME_CATEGORIES: CategoryConfig[] = [
  { name: 'Salaris', icon: 'Briefcase', color: '#22c55e' },
  { name: 'Freelance', icon: 'Laptop', color: '#6366f1' },
  { name: 'Investering', icon: 'TrendingUp', color: '#3b82f6' },
  { name: 'Cadeau', icon: 'Gift', color: '#ec4899' },
  { name: 'Overig', icon: 'MoreHorizontal', color: '#64748b' },
];

export function getCategoryColor(name: string): string {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return all.find(c => c.name === name)?.color ?? '#64748b';
}
