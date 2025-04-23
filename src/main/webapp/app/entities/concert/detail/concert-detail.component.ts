import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IConcert } from '../concert.model';

@Component({
  standalone: true,
  selector: 'jhi-concert-detail',
  templateUrl: './concert-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ConcertDetailComponent {
  concert = input<IConcert | null>(null);

  previousState(): void {
    window.history.back();
  }
}
