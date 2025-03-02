import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISong } from '../song.model';
import { SongService } from '../service/song.service';

@Component({
  standalone: true,
  templateUrl: './song-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SongDeleteDialogComponent {
  song?: ISong;

  protected songService = inject(SongService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.songService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
