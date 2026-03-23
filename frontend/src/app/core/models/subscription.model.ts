export interface Subscription {
  id: string;
  name: string;
  amount: number;
  periodicity: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  billingDate: string; // e.g. "2024-05-15" or simply the day of the month
  categoryId: string;
  status: 'ACTIVE' | 'CANCELLED';
  logo?: string;
}
