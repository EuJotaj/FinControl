import { Component } from '@angular/core';
import { ModalService, ModalData } from './shared/services/modal.service';
import { Observable, combineLatest } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { map, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent {
  title = 'FinanceApp';
  modalState$: Observable<{ isOpen: boolean; config?: ModalData }>;
  showLayout$: Observable<boolean>;

  constructor(
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService
  ) {
    this.modalState$ = this.modalService.modalState$;

    const routeEvents$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects || event.url),
      startWith(this.router.url)
    );

    this.showLayout$ = combineLatest([
      routeEvents$,
      this.authService.currentUser$
    ]).pipe(
      map(([url, user]) => {
        const urlPath = url.split('?')[0]; // Ignore query params
        const isAuthRoute = urlPath.startsWith('/auth');
        const isLandingRoute = urlPath === '/' || urlPath === '';
        return !!user && !isAuthRoute && !isLandingRoute;
      })
    );
  }
}
