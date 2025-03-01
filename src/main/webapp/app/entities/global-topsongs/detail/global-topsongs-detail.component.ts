import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IGlobalTopsongs } from '../global-topsongs.model';

@Component({
  standalone: true,
  selector: 'jhi-global-topsongs-detail',
  templateUrl: './global-topsongs-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GlobalTopsongsDetailComponent {
  globalTopsongs = input<IGlobalTopsongs | null>(null);

  previousState(): void {
    window.history.back();
  }
}
