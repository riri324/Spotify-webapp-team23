import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGlobalTopsongs } from '../global-topsongs.model';
import { GlobalTopsongsService } from '../service/global-topsongs.service';
import { GlobalTopsongsFormGroup, GlobalTopsongsFormService } from './global-topsongs-form.service';

@Component({
  standalone: true,
  selector: 'jhi-global-topsongs-update',
  templateUrl: './global-topsongs-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GlobalTopsongsUpdateComponent implements OnInit {
  isSaving = false;
  globalTopsongs: IGlobalTopsongs | null = null;

  protected globalTopsongsService = inject(GlobalTopsongsService);
  protected globalTopsongsFormService = inject(GlobalTopsongsFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GlobalTopsongsFormGroup = this.globalTopsongsFormService.createGlobalTopsongsFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ globalTopsongs }) => {
      this.globalTopsongs = globalTopsongs;
      if (globalTopsongs) {
        this.updateForm(globalTopsongs);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const globalTopsongs = this.globalTopsongsFormService.getGlobalTopsongs(this.editForm);
    if (globalTopsongs.id !== null) {
      this.subscribeToSaveResponse(this.globalTopsongsService.update(globalTopsongs));
    } else {
      this.subscribeToSaveResponse(this.globalTopsongsService.create(globalTopsongs));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGlobalTopsongs>>): void {
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

  protected updateForm(globalTopsongs: IGlobalTopsongs): void {
    this.globalTopsongs = globalTopsongs;
    this.globalTopsongsFormService.resetForm(this.editForm, globalTopsongs);
  }
}
