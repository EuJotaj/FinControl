import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransactionsRoutingModule,
    CoreModule
  ]
})
export class TransactionsModule { }
