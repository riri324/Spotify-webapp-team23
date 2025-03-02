import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IUserPreference } from '../user-preference.model';

@Component({
  standalone: true,
  selector: 'jhi-user-preference-detail',
  templateUrl: './user-preference-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class UserPreferenceDetailComponent {
  userPreference = input<IUserPreference | null>(null);

  previousState(): void {
    window.history.back();
  }
}
