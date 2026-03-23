import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Category, CreditCard } from '../../../core/models/transaction.model';
import { TransactionService } from '../../../core/services/transaction.service';
import { CardService } from '../../../core/services/card.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
  standalone: false
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  categories$: Observable<Category[]> | undefined;
  cards$: Observable<CreditCard[]> | undefined;
  isSaving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private mockData: MockDataService,
    private transactionService: TransactionService,
    private cardService: CardService
  ) {
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: ['EXPENSE', Validators.required],
      categoryId: ['', Validators.required],
      cardId: [''],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories$ = this.mockData.getCategories();
    this.cards$ = this.cardService.getCards();
  }

  save(): void {
    if (this.transactionForm.invalid) return;
    
    this.isSaving = true;
    this.error = '';

    const val = this.transactionForm.value;
    const payload = {
      ...val,
      categoryId: val.categoryId === '' ? null : val.categoryId,
      cardId: val.cardId === '' ? null : val.cardId,
      status: 'COMPLETED' // Default for new transactions
    };

    this.transactionService.createTransaction(payload).subscribe({
      next: () => {
        this.isSaving = false;
        // In a real app we'd dispatch an event or reload the transactions behavior subject.
        // For now, reloading the page is the safest way to ensure the list updates.
        window.location.reload();
        this.modalService.close();
      },
      error: (err) => {
        this.isSaving = false;
        this.error = 'Erro ao salvar transação. Tente novamente.';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.modalService.close();
  }
}
