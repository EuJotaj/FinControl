import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { SubscriptionsComponent } from './subscriptions.component';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [SubscriptionsComponent],
  imports: [CommonModule, SubscriptionsRoutingModule, CoreModule]
})
export class SubscriptionsModule { }
