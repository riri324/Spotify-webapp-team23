import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILikedSongs } from '../liked-songs.model';
import { LikedSongsService } from '../service/liked-songs.service';

@Component({
  standalone: true,
  templateUrl: './liked-songs-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LikedSongsDeleteDialogComponent {
  likedSongs?: ILikedSongs;

  protected likedSongsService = inject(LikedSongsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.likedSongsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
