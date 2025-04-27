import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IConcert } from '../concert.model';
import { ConcertService } from '../service/concert.service';

@Component({
  standalone: true,
  templateUrl: './concert-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConcertDeleteDialogComponent {
  concert?: IConcert;

  protected concertService = inject(ConcertService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.concertService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
