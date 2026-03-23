import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api/subscriptions';

  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscription);
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/${id}`, subscription);
  }

  renewSubscription(id: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/${id}/renew`, {});
  }

  paySubscription(id: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/${id}/pay`, {});
  }

  cancelSubscription(id: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteSubscription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
