import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserPreference } from '../user-preference.model';
import { UserPreferenceService } from '../service/user-preference.service';

@Component({
  standalone: true,
  templateUrl: './user-preference-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserPreferenceDeleteDialogComponent {
  userPreference?: IUserPreference;

  protected userPreferenceService = inject(UserPreferenceService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userPreferenceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
