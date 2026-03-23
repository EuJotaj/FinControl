import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { CardService } from '../../../core/services/card.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  standalone: false
})
export class CardFormComponent {
  cardForm: FormGroup;
  banks = ['NuBank', 'Inter', 'Itaú', 'Bradesco', 'Santander', 'C6 Bank'];
  colors = ['#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#1E293B'];

  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService,
    private cardService: CardService
  ) {
    this.cardForm = this.fb.group({
      bank: ['NuBank', Validators.required],
      lastDigits: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      limit: [null, [Validators.required, Validators.min(0)]],
      used: [0, [Validators.required, Validators.min(0)]],
      color: ['#8B5CF6', Validators.required]
    });
  }

  save() {
    if (this.cardForm.valid) {
      this.cardService.createCard(this.cardForm.value).subscribe({
        next: () => {
          window.location.reload(); // Refresh to show new card
          this.modalService.close();
        },
        error: (err) => {
          console.error('Error saving card:', err);
          alert('Erro ao salvar cartão.');
        }
      });
    }
  }

  cancel() {
    this.modalService.close();
  }
}
