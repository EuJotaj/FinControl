import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { SubscriptionService } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  standalone: false
})
export class SubscriptionFormComponent implements OnInit {
  subscriptionForm: FormGroup;
  isEditMode = false;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService,
    private subscriptionService: SubscriptionService
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      nextBillingDate: ['', Validators.required],
      frequency: ['MONTHLY', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.modalService.modalState$.subscribe(state => {
      if (state.isOpen && state.config?.type === 'subscription' && state.config.data) {
        this.isEditMode = true;
        this.editingId = state.config.data.id;
        this.subscriptionForm.patchValue(state.config.data);
      } else {
        this.isEditMode = false;
        this.editingId = null;
      }
    });
  }

  save() {
    if (this.subscriptionForm.valid) {
      const obs = this.isEditMode && this.editingId
        ? this.subscriptionService.updateSubscription(this.editingId, this.subscriptionForm.value)
        : this.subscriptionService.createSubscription(this.subscriptionForm.value);

      obs.subscribe({
        next: () => {
          window.location.reload();
          this.modalService.close();
        },
        error: (err) => {
          console.error('Error saving subscription:', err);
          alert('Erro ao salvar assinatura.');
        }
      });
    }
  }

  cancel() {
    this.modalService.close();
  }
}
