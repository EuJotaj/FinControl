import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { CardService } from '../../../core/services/card.service';
import { CreditCard } from '../../../core/models/transaction.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  standalone: false
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  cards$: Observable<CreditCard[]> | undefined;
  isActionMode = false;
  selectedInvoice: any = null;

  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService,
    private invoiceService: InvoiceService,
    private cardService: CardService
  ) {
    this.invoiceForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', Validators.required],
      category: ['Cartão de Crédito', Validators.required],
      cardId: ['']
    });
  }

  ngOnInit(): void {
    this.cards$ = this.cardService.getCards();
    this.modalService.modalState$.subscribe(state => {
      if (state.isOpen && state.config?.type === 'invoice') {
        if (state.config.data) {
          this.isActionMode = true;
          this.selectedInvoice = state.config.data;
          this.invoiceForm.patchValue({
            ...this.selectedInvoice,
            dueDate: this.selectedInvoice.dueDate ? new Date(this.selectedInvoice.dueDate).toISOString().substring(0, 10) : ''
          });
        } else {
          this.isActionMode = false;
          this.selectedInvoice = null;
          this.invoiceForm.reset({
            category: 'Cartão de Crédito',
            description: '',
            amount: null,
            dueDate: '',
            cardId: ''
          });
        }
      }
    });
  }

  pay() {
    if (this.selectedInvoice?.id) {
      this.invoiceService.payInvoice(this.selectedInvoice.id).subscribe({
        next: () => {
          window.location.reload();
          this.modalService.close();
        },
        error: (err) => {
          console.error('Error paying invoice:', err);
          alert('Erro ao pagar fatura.');
        }
      });
    }
  }

  save() {
    if (this.invoiceForm.valid) {
      const val = this.invoiceForm.value;
      const payload = {
        ...val,
        cardId: val.cardId === '' ? null : val.cardId,
        status: this.isActionMode ? this.selectedInvoice.status : 'UNPAID'
      };
      
      const request = this.isActionMode && this.selectedInvoice?.id 
        ? this.invoiceService.updateInvoice(this.selectedInvoice.id, payload)
        : this.invoiceService.createInvoice(payload);

      request.subscribe({
        next: () => {
          window.location.reload();
          this.modalService.close();
        },
        error: (err) => {
          console.error('Error saving invoice:', err);
          alert('Erro ao salvar fatura.');
        }
      });
    }
  }

  cancel() {
    this.modalService.close();
  }
}
