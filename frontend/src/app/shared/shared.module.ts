import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from './components/modal/modal.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CardFormComponent } from './components/card-form/card-form.component';

@NgModule({
  declarations: [
    ModalComponent,
    TransactionFormComponent,
    InvoiceFormComponent,
    SubscriptionFormComponent,
    CategoryFormComponent,
    CardFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    TransactionFormComponent,
    InvoiceFormComponent,
    SubscriptionFormComponent,
    CategoryFormComponent,
    CardFormComponent
  ]
})
export class SharedModule { }
