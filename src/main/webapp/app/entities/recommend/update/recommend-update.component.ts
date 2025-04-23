import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRecommend } from '../recommend.model';
import { RecommendService } from '../service/recommend.service';
import { RecommendFormGroup, RecommendFormService } from './recommend-form.service';

@Component({
  standalone: true,
  selector: 'jhi-recommend-update',
  templateUrl: './recommend-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class RecommendUpdateComponent implements OnInit {
  isSaving = false;
  recommend: IRecommend | null = null;

  protected recommendService = inject(RecommendService);
  protected recommendFormService = inject(RecommendFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: RecommendFormGroup = this.recommendFormService.createRecommendFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recommend }) => {
      this.recommend = recommend;
      if (recommend) {
        this.updateForm(recommend);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recommend = this.recommendFormService.getRecommend(this.editForm);
    if (recommend.id !== null) {
      this.subscribeToSaveResponse(this.recommendService.update(recommend));
    } else {
      this.subscribeToSaveResponse(this.recommendService.create(recommend));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecommend>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(recommend: IRecommend): void {
    this.recommend = recommend;
    this.recommendFormService.resetForm(this.editForm, recommend);
  }
}
