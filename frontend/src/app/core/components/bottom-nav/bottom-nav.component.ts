import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  standalone: false
})
export class BottomNavComponent {

  navItems = [
    { icon: 'grid_view', label: 'nav.dashboard', route: '/dashboard' },
    { icon: 'receipt_long', label: 'nav.transactions', route: '/transactions' },
    { icon: 'account_balance_wallet', label: 'nav.cards', route: '/cards' },
    { icon: 'person', label: 'nav.profile', route: '/settings' }
  ];

  constructor(
    private router: Router,
    private modalService: ModalService
  ) {}

  isActive(route: string): boolean {
    // Only highlight exact dashboard route, or partial match otherwise
    if (route === '/dashboard') {
      return this.router.url === '/dashboard';
    }
    return this.router.url.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  // The huge center button triggers a modal for adding transactions
  openAddTransaction(): void {
    this.modalService.open({ type: 'transaction', title: '' }); // Uses the app's standard modal service
  }
}
