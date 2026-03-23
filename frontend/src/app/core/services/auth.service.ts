import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthentication(res))
    );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => this.handleAuthentication(res))
    );
  }

  private handleAuthentication(res: AuthResponse): void {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user_data', JSON.stringify(res.user));
    if (res.activeTenantId) {
      localStorage.setItem('tenant_id', res.activeTenantId);
    }
    this.currentUserSubject.next(res.user);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getTenantId(): string | null {
    return localStorage.getItem('tenant_id');
  }

  setTenantId(tenantId: string): void {
    localStorage.setItem('tenant_id', tenantId);
  }

  updateCurrentUser(partial: Partial<{ name: string; phone: string }>): void {
    const current = this.currentUserSubject.value;
    if (!current) return;
    const updated = { ...current, ...partial };
    localStorage.setItem('user_data', JSON.stringify(updated));
    this.currentUserSubject.next(updated);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  }
}
