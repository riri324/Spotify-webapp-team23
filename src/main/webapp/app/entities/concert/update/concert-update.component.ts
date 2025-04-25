import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IConcert } from '../concert.model';
import { ConcertService } from '../service/concert.service';
import { ConcertFormGroup, ConcertFormService } from './concert-form.service';

@Component({
  standalone: true,
  selector: 'jhi-concert-update',
  templateUrl: './concert-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConcertUpdateComponent implements OnInit {
  isSaving = false;
  concert: IConcert | null = null;

  protected concertService = inject(ConcertService);
  protected concertFormService = inject(ConcertFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ConcertFormGroup = this.concertFormService.createConcertFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ concert }) => {
      this.concert = concert;
      if (concert) {
        this.updateForm(concert);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const concert = this.concertFormService.getConcert(this.editForm);
    if (concert.id !== null) {
      this.subscribeToSaveResponse(this.concertService.update(concert));
    } else {
      this.subscribeToSaveResponse(this.concertService.create(concert));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConcert>>): void {
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

  protected updateForm(concert: IConcert): void {
    this.concert = concert;
    this.concertFormService.resetForm(this.editForm, concert);
  }
}
