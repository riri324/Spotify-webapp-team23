import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IListeningHistory } from '../listening-history.model';

@Component({
  standalone: true,
  selector: 'jhi-listening-history-detail',
  templateUrl: './listening-history-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ListeningHistoryDetailComponent {
  listeningHistory = input<IListeningHistory | null>(null);

  previousState(): void {
    window.history.back();
  }
}
