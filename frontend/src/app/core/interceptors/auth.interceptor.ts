import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const tenantId = this.authService.getTenantId();

    let headers = req.headers;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (tenantId) {
      headers = headers.set('X-Tenant-ID', tenantId);
    }

    if (token || tenantId) {
      req = req.clone({ headers });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          // Check if it's our semantic lock from TenantFilter
          if (typeof error.error === 'string' && error.error.includes('read-only')) {
             alert('Aviso: Seu Workspace está no Modo Somente Leitura devido à Assinatura expirada. Atualize o plano PRO para adicionar novos dados.');
             this.router.navigate(['/billing']);
          } else {
             this.authService.logout();
             this.router.navigate(['/auth/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
