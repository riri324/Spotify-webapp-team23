import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IRecommend } from '../recommend.model';
import { RecommendService } from '../service/recommend.service';

@Component({
  standalone: true,
  templateUrl: './recommend-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class RecommendDeleteDialogComponent {
  recommend?: IRecommend;

  protected recommendService = inject(RecommendService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recommendService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
