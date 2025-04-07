import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ILikedSongs } from '../liked-songs.model';

@Component({
  standalone: true,
  selector: 'jhi-liked-songs-detail',
  templateUrl: './liked-songs-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LikedSongsDetailComponent {
  likedSongs = input<ILikedSongs | null>(null);

  previousState(): void {
    window.history.back();
  }
}
