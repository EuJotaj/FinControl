import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CreditCard } from '../../core/models/transaction.model';
import { ModalService } from '../../shared/services/modal.service';
import { CardService } from '../../core/services/card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  standalone: false
})
export class CardsComponent implements OnInit {
  cards$: Observable<CreditCard[]> | undefined;

  constructor(
    private cardService: CardService,
    private modalService: ModalService
  ) {}

  openAddCard(): void {
    this.modalService.open({ title: 'Novo Cartão', type: 'card' });
  }

  ngOnInit(): void {
    this.cards$ = this.cardService.getCards().pipe(
      catchError(err => {
        console.error('Error fetching cards:', err);
        return of([]);
      })
    );
  }

  getPercentage(used: number, limit: number): number {
    return (used / limit) * 100;
  }
}
