import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPlaylist } from '../playlist.model';
import { PlaylistService } from '../service/playlist.service';

@Component({
  standalone: true,
  templateUrl: './playlist-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PlaylistDeleteDialogComponent {
  playlist?: IPlaylist;

  protected playlistService = inject(PlaylistService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.playlistService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
