import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription } from '../../core/models/transaction.model';
import { ModalService } from '../../shared/services/modal.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
  standalone: false
})
export class SubscriptionsComponent implements OnInit {
  subscriptions$!: Observable<Subscription[]>;
  monthlyCost$!: Observable<number>;
  annualCost$!: Observable<number>;
  monthlyCount$!: Observable<number>;
  annualCount$!: Observable<number>;

  constructor(
    private subscriptionService: SubscriptionService,
    private modalService: ModalService,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.subscriptions$ = this.subscriptionService.getSubscriptions().pipe(
      catchError(() => of([])),
      shareReplay(1)
    );

    // Monthly services raw cost
    const monthly$ = this.subscriptions$.pipe(
      map(list => list.filter(s => s.frequency === 'MONTHLY'))
    );

    // Annual services raw cost
    const annual$ = this.subscriptions$.pipe(
      map(list => list.filter(s => s.frequency === 'YEARLY'))
    );

    this.monthlyCount$ = monthly$.pipe(map(l => l.length));
    this.annualCount$  = annual$.pipe(map(l => l.length));

    // Total monthly spend = monthly services + annual services / 12
    this.monthlyCost$ = this.subscriptions$.pipe(
      map(list => {
        const monthly = list.filter(s => s.frequency === 'MONTHLY').reduce((acc, s) => acc + s.amount, 0);
        const annual  = list.filter(s => s.frequency !== 'MONTHLY').reduce((acc, s) => acc + s.amount / 12, 0);
        return monthly + annual;
      })
    );

    // Total annual spend = monthly × 12 + annual
    this.annualCost$ = this.subscriptions$.pipe(
      map(list => {
        const monthly = list.filter(s => s.frequency === 'MONTHLY').reduce((acc, s) => acc + s.amount * 12, 0);
        const annual  = list.filter(s => s.frequency !== 'MONTHLY').reduce((acc, s) => acc + s.amount, 0);
        return monthly + annual;
      })
    );
  }

  openAddSubscription(): void {
    this.modalService.open({ title: 'Nova Assinatura', type: 'subscription' });
  }

  getFrequencyLabel(freq: string): string {
    return freq === 'MONTHLY' ? 'Mensal' : 'Anual';
  }

  getFrequencyColor(freq: string): string {
    return freq === 'MONTHLY'
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400';
  }

  getDaysUntilBilling(dateStr: string): number {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  getUrgencyClass(dateStr: string): string {
    const days = this.getDaysUntilBilling(dateStr);
    if (days <= 3) return 'text-rose-500';
    if (days <= 7) return 'text-amber-500';
    return 'text-slate-500 dark:text-slate-400';
  }

  onEdit(subscription: Subscription): void {
    this.modalService.open({ 
      title: 'Editar Assinatura', 
      type: 'subscription', 
      data: subscription 
    });
  }

  onRenew(id: string): void {
    this.subscriptionService.renewSubscription(id).subscribe(() => {
      window.location.reload();
    });
  }

  onPay(id: string): void {
    this.subscriptionService.paySubscription(id).subscribe(() => {
      window.location.reload();
    });
  }

  onCancel(id: string): void {
    if (confirm('Deseja realmente cancelar esta assinatura?')) {
      this.subscriptionService.cancelSubscription(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Deseja realmente excluir esta assinatura?')) {
      this.subscriptionService.deleteSubscription(id).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
