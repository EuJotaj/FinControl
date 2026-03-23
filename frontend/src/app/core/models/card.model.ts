export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  limit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  color?: string; // e.g., 'purple' for Nubank, 'orange' for Inter
}

export interface CardPurchase {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  date: string;
  installments: number; // For parcelamento
  currentInstallment: number;
  categoryId: string;
}

export interface Invoice {
  id: string;
  cardId: string;
  month: number;
  year: number;
  totalAmount: number;
  status: 'OPEN' | 'CLOSED' | 'PAID' | 'OVERDUE';
  purchases: CardPurchase[];
  dueDate: string;
}
