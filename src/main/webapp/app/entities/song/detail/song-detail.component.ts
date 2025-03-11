import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ISong } from '../song.model';

@Component({
  standalone: true,
  selector: 'jhi-song-detail',
  templateUrl: './song-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SongDetailComponent {
  song = input<ISong | null>(null);

  previousState(): void {
    window.history.back();
  }
}
