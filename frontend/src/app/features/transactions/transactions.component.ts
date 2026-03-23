import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { catchError, map, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Transaction } from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { ModalService } from '../../shared/services/modal.service';
import { SettingsService } from '../../core/services/settings.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  standalone: false
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private allTransactions$ = new BehaviorSubject<Transaction[]>([]);

  isLoading = true;
  showFilters = false;

  // Filters
  searchTerm$ = new BehaviorSubject<string>('');
  typeFilter$ = new BehaviorSubject<string>('ALL');
  statusFilter$ = new BehaviorSubject<string>('ALL');

  // Filtered result
  filtered$: Observable<Transaction[]>;
  isDarkTheme$: Observable<boolean>;

  filterForm: FormGroup;

  constructor(
    private transactionService: TransactionService,
    private modalService: ModalService,
    public settingsService: SettingsService,
    public themeService: ThemeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
    this.filterForm = this.fb.group({
      search: [''],
      type: ['ALL'],
      status: ['ALL']
    });

    // Combine all transactions with the filter streams
    this.filtered$ = combineLatest([
      this.allTransactions$,
      this.searchTerm$,
      this.typeFilter$,
      this.statusFilter$
    ]).pipe(
      map(([transactions, search, type, status]) =>
        transactions
          .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
          .filter(t => type === 'ALL' || t.type === type)
          .filter(t => status === 'ALL' || t.status === status)
      )
    );
  }

  ngOnInit(): void {
    // Force initial render immediately
    this.cdr.detectChanges();

    // Load transactions
    this.transactionService.getTransactions().pipe(
      catchError(err => {
        console.error('Error fetching transactions:', err);
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.allTransactions$.next(data);
      this.isLoading = false;
      this.cdr.detectChanges(); // Force UI update when data arrives
    });

    // Wire form control changes to filter streams
    this.filterForm.get('search')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(v => {
      this.searchTerm$.next(v || '');
      this.cdr.detectChanges();
    });

    this.filterForm.get('type')!.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(v => {
      this.typeFilter$.next(v);
      this.cdr.detectChanges();
    });

    this.filterForm.get('status')!.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(v => {
      this.statusFilter$.next(v);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNewTransaction(): void {
    this.modalService.open({ title: 'Nova Transação', type: 'transaction' });
  }

  editTransaction(t: Transaction): void {
    this.modalService.open({ title: 'Editar Transação', type: 'transaction', data: t });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', type: 'ALL', status: 'ALL' });
  }

  get hasActiveFilters(): boolean {
    const v = this.filterForm.value;
    return v.search || v.type !== 'ALL' || v.status !== 'ALL';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      COMPLETED: 'Concluída',
      PENDING: 'Pendente',
      CANCELLED: 'Cancelada'
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
      PENDING:   'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
      CANCELLED: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
    };
    return classes[status] ?? 'bg-slate-100 text-slate-500';
  }
}
