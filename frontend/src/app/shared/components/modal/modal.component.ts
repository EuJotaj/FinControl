import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shared-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: false
})
export class ModalComponent {
  modalState$: Observable<any>;

  constructor(private modalService: ModalService) {
    this.modalState$ = this.modalService.modalState$;
  }

  close() {
    this.modalService.close();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
