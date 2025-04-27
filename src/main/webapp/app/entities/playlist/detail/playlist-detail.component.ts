import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPlaylist } from '../playlist.model';

@Component({
  standalone: true,
  selector: 'jhi-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PlaylistDetailComponent {
  playlist = input<IPlaylist | null>(null);

  previousState(): void {
    window.history.back();
  }
}
