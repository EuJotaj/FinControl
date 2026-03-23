import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalData {
  title: string;
  type: 'transaction' | 'invoice' | 'subscription' | 'category' | 'card' | 'profile';
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<{ isOpen: boolean; config?: ModalData }>({ isOpen: false });
  modalState$ = this.modalState.asObservable();

  open(config: ModalData) {
    this.modalState.next({ isOpen: true, config });
  }

  close() {
    this.modalState.next({ isOpen: false });
  }
}
