import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IRecommend } from '../recommend.model';

@Component({
  standalone: true,
  selector: 'jhi-recommend-detail',
  templateUrl: './recommend-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class RecommendDetailComponent {
  recommend = input<IRecommend | null>(null);

  previousState(): void {
    window.history.back();
  }
}
