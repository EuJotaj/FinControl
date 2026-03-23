import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Transaction, Category, Invoice, Subscription, CreditCard } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  private categories: Category[] = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Alimentação', color: '#EF4444', icon: 'restaurant', type: 'EXPENSE' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Transporte', color: '#F59E0B', icon: 'directions_car', type: 'EXPENSE' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Salário', color: '#10B981', icon: 'account_balance_wallet', type: 'INCOME' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'Lazer', color: '#8B5CF6', icon: 'sports_esports', type: 'EXPENSE' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'Saúde', color: '#EC4899', icon: 'medical_services', type: 'EXPENSE' },
    { id: '66666666-6666-6666-6666-666666666666', name: 'Educação', color: '#3B82F6', icon: 'school', type: 'EXPENSE' }
  ];

  private transactions: Transaction[] = [
    { id: 't1111111-1111-1111-1111-111111111111', description: 'Supermercado', amount: 450.50, date: new Date().toISOString(), type: 'EXPENSE', categoryId: '11111111-1111-1111-1111-111111111111', status: 'COMPLETED' },
    { id: 't2222222-2222-2222-2222-222222222222', description: 'Uber', amount: 35.00, date: new Date().toISOString(), type: 'EXPENSE', categoryId: '22222222-2222-2222-2222-222222222222', status: 'COMPLETED' },
    { id: 't3333333-3333-3333-3333-333333333333', description: 'Salário ref. Mês', amount: 5000.00, date: new Date().toISOString(), type: 'INCOME', categoryId: '33333333-3333-3333-3333-333333333333', status: 'COMPLETED' },
    { id: 't4444444-4444-4444-4444-444444444444', description: 'Farmácia', amount: 120.00, date: new Date(Date.now() - 86400000).toISOString(), type: 'EXPENSE', categoryId: '55555555-5555-5555-5555-555555555555', status: 'COMPLETED' },
    { id: 't5555555-5555-5555-5555-555555555555', description: 'Restaurante', amount: 85.00, date: new Date(Date.now() - 172800000).toISOString(), type: 'EXPENSE', categoryId: '11111111-1111-1111-1111-111111111111', status: 'COMPLETED' }
  ];

  private invoices: Invoice[] = [
    { id: 'e1111111-1111-1111-1111-111111111111', description: 'Fatura NuBank - Março', amount: 1250.80, dueDate: '2026-03-25', status: 'UNPAID', category: 'Cartão de Crédito' },
    { id: 'e2222222-2222-2222-2222-222222222222', description: 'Aluguel', amount: 2200.00, dueDate: '2026-03-10', status: 'PAID', category: 'Moradia' },
    { id: 'e3333333-3333-3333-3333-333333333333', description: 'Internet Fibonacci', amount: 120.00, dueDate: '2026-03-15', status: 'UNPAID', category: 'Serviços' }
  ];

  private subscriptions: Subscription[] = [
    { id: 'f1111111-1111-1111-1111-111111111111', name: 'Netflix', amount: 55.90, nextBillingDate: '2026-04-01', frequency: 'MONTHLY', status: 'ACTIVE', icon: 'movie' },
    { id: 'f2222222-2222-2222-2222-222222222222', name: 'Spotify', amount: 21.90, nextBillingDate: '2026-03-28', frequency: 'MONTHLY', status: 'ACTIVE', icon: 'music_note' },
    { id: 'f3333333-3333-3333-3333-333333333333', name: 'Amazon Prime', amount: 119.00, nextBillingDate: '2027-01-15', frequency: 'YEARLY', status: 'ACTIVE', icon: 'shopping_cart' },
    { id: 'f4444444-4444-4444-4444-444444444444', name: 'Academia', amount: 110.00, nextBillingDate: '2026-03-20', frequency: 'MONTHLY', status: 'ACTIVE', icon: 'fitness_center' }
  ];

  private cards: CreditCard[] = [
    { id: 'd1111111-1111-1111-1111-111111111111', bank: 'NuBank', lastDigits: '1234', limit: 5000, used: 1250.80, color: '#8B5CF6' },
    { id: 'd2222222-2222-2222-2222-222222222222', bank: 'Inter', lastDigits: '5678', limit: 3000, used: 450.00, color: '#F59E0B' }
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(500));
  }

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions).pipe(delay(600));
  }

  getInvoices(): Observable<Invoice[]> {
    return of(this.invoices).pipe(delay(400));
  }

  getSubscriptions(): Observable<Subscription[]> {
    return of(this.subscriptions).pipe(delay(450));
  }

  getCards(): Observable<CreditCard[]> {
    return of(this.cards).pipe(delay(350));
  }

  getDashboardSummary(): Observable<any> {
    return of({
      totalIncome: 5000,
      totalExpense: 690.50,
      balance: 4309.50,
      recentTransactions: this.transactions.slice(0, 5)
    }).pipe(delay(400));
  }
}
