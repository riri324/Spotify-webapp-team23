import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IListeningHistory } from '../listening-history.model';
import { ListeningHistoryService } from '../service/listening-history.service';

@Component({
  standalone: true,
  templateUrl: './listening-history-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ListeningHistoryDeleteDialogComponent {
  listeningHistory?: IListeningHistory;

  protected listeningHistoryService = inject(ListeningHistoryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.listeningHistoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
