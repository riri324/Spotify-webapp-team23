import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IGenre } from '../genre.model';

@Component({
  standalone: true,
  selector: 'jhi-genre-detail',
  templateUrl: './genre-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GenreDetailComponent {
  genre = input<IGenre | null>(null);

  previousState(): void {
    window.history.back();
  }
}
