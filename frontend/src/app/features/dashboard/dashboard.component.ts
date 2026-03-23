import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../shared/services/modal.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { SettingsService } from '../../core/services/settings.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class DashboardComponent implements OnInit {
  summary$: Observable<any> | undefined;
  protected Math = Math;

  constructor(
    private dashboardService: DashboardService,
    private modalService: ModalService,
    public settingsService: SettingsService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.summary$ = this.dashboardService.getSummary().pipe(
      catchError(err => {
        console.error('Error fetching dashboard summary:', err);
        return of(null);
      })
    );
  }

  getCategoryPercent(amount: number, total: number): number {
    if (!total) return 0;
    return (amount / total) * 100;
  }

  getSortedCategories(expensesByCategory: any): any[] {
    if (!expensesByCategory) return [];
    return Object.entries(expensesByCategory)
      .map(([name, amount]) => ({ name, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount);
  }

  getMonthlyTrendItems(monthlyTrends: any): any[] {
    if (!monthlyTrends) return [];
    return Object.entries(monthlyTrends)
      .map(([date, amount]) => ({ date, amount: amount as number }))
      .sort((a, b) => {
        // Simple sort by MM/YYYY
        const [m1, y1] = a.date.split('/').map(Number);
        const [m2, y2] = b.date.split('/').map(Number);
        return (y1 * 12 + m1) - (y2 * 12 + m2);
      });
  }

  getMaxAmount(trends: any[]): number {
    if (!trends.length) return 1;
    const max = Math.max(...trends.map(t => Math.abs(t.amount)));
    return max || 1;
  }

  openAddTransaction(): void {
    this.modalService.open({
      title: 'Nova Transação',
      type: 'transaction'
    });
  }

  payInvoice(id: string): void {
    this.invoiceService.payInvoice(id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Error paying invoice:', err);
      }
    });
  }
}
