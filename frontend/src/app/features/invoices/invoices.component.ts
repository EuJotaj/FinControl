import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Invoice } from '../../core/models/transaction.model';
import { ModalService } from '../../shared/services/modal.service';
import { InvoiceService } from '../../core/services/invoice.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  standalone: false
})
export class InvoicesComponent implements OnInit {
  invoices$: Observable<Invoice[]> | undefined;
  activeMenuId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private modalService: ModalService
  ) {}

  openAddInvoice(): void {
    this.modalService.open({ title: 'Nova Fatura', type: 'invoice' });
  }

  ngOnInit(): void {
    this.invoices$ = this.invoiceService.getInvoices().pipe(
      catchError(err => {
        console.error('Error fetching invoices:', err);
        return of([]);
      })
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'UNPAID': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'OVERDUE': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAID': return 'Pago';
      case 'UNPAID': return 'Pendente';
      case 'OVERDUE': return 'Atrasado';
      default: return status;
    }
  }

  onPayInvoice(id: string): void {
    if (confirm('Marcar esta fatura como paga?')) {
      this.invoiceService.payInvoice(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  onDeleteInvoice(id: string): void {
    if (confirm('Deseja realmente excluir esta fatura?')) {
      this.invoiceService.deleteInvoice(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  onEditInvoice(invoice: Invoice): void {
    this.modalService.open({
      title: 'Editar Fatura',
      type: 'invoice',
      data: invoice
    });
    this.activeMenuId = null;
  }

  toggleMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenuId = null;
  }
}
