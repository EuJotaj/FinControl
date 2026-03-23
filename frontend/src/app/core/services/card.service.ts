import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'http://localhost:8080/api/cards';

  constructor(private http: HttpClient) {}

  getCards(): Observable<CreditCard[]> {
    return this.http.get<CreditCard[]>(this.apiUrl);
  }

  createCard(card: Partial<CreditCard>): Observable<CreditCard> {
    return this.http.post<CreditCard>(this.apiUrl, card);
  }
}
