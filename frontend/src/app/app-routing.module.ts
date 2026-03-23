import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'transactions', canActivate: [AuthGuard], loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule) },
  { path: 'cards', canActivate: [AuthGuard], loadChildren: () => import('./features/cards/cards.module').then(m => m.CardsModule) },
  { path: 'invoices', canActivate: [AuthGuard], loadChildren: () => import('./features/invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'subscriptions', canActivate: [AuthGuard], loadChildren: () => import('./features/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule) },
  { path: 'categories', canActivate: [AuthGuard], loadChildren: () => import('./features/categories/categories.module').then(m => m.CategoriesModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'profile', canActivate: [AuthGuard], loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'settings', canActivate: [AuthGuard], loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  { path: 'admin', canActivate: [AuthGuard], loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'billing', canActivate: [AuthGuard], loadChildren: () => import('./features/billing/billing.module').then(m => m.BillingModule) },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
