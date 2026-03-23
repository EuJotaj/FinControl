export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

export interface CreditCard {
  id: string;
  bank: string;
  lastDigits: string;
  limit: number;
  used: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  cardId?: string;
}

export interface Invoice {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  category: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextBillingDate: string;
  frequency: 'MONTHLY' | 'YEARLY';
  status: 'ACTIVE' | 'CANCELED' | 'PAID' | 'PAUSED';
  icon: string;
}
