import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGlobalTopsongs } from '../global-topsongs.model';
import { GlobalTopsongsService } from '../service/global-topsongs.service';

@Component({
  standalone: true,
  templateUrl: './global-topsongs-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GlobalTopsongsDeleteDialogComponent {
  globalTopsongs?: IGlobalTopsongs;

  protected globalTopsongsService = inject(GlobalTopsongsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.globalTopsongsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
