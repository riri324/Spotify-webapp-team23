import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { IListeningHistory } from '../listening-history.model';
import { ListeningHistoryService } from '../service/listening-history.service';
import { ListeningHistoryFormGroup, ListeningHistoryFormService } from './listening-history-form.service';

@Component({
  standalone: true,
  selector: 'jhi-listening-history-update',
  templateUrl: './listening-history-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ListeningHistoryUpdateComponent implements OnInit {
  isSaving = false;
  listeningHistory: IListeningHistory | null = null;

  songsSharedCollection: ISong[] = [];

  protected listeningHistoryService = inject(ListeningHistoryService);
  protected listeningHistoryFormService = inject(ListeningHistoryFormService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ListeningHistoryFormGroup = this.listeningHistoryFormService.createListeningHistoryFormGroup();

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ listeningHistory }) => {
      this.listeningHistory = listeningHistory;
      if (listeningHistory) {
        this.updateForm(listeningHistory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const listeningHistory = this.listeningHistoryFormService.getListeningHistory(this.editForm);
    if (listeningHistory.id !== null) {
      this.subscribeToSaveResponse(this.listeningHistoryService.update(listeningHistory));
    } else {
      this.subscribeToSaveResponse(this.listeningHistoryService.create(listeningHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IListeningHistory>>): void {
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

  protected updateForm(listeningHistory: IListeningHistory): void {
    this.listeningHistory = listeningHistory;
    this.listeningHistoryFormService.resetForm(this.editForm, listeningHistory);

    this.songsSharedCollection = this.songService.addSongToCollectionIfMissing<ISong>(
      this.songsSharedCollection,
      ...(listeningHistory.songs ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, ...(this.listeningHistory?.songs ?? []))))
      .subscribe((songs: ISong[]) => (this.songsSharedCollection = songs));
  }
}
