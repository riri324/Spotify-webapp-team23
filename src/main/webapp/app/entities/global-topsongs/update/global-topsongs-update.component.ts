import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
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

  songsSharedCollection: ISong[] = [];

  protected globalTopsongsService = inject(GlobalTopsongsService);
  protected globalTopsongsFormService = inject(GlobalTopsongsFormService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GlobalTopsongsFormGroup = this.globalTopsongsFormService.createGlobalTopsongsFormGroup();

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ globalTopsongs }) => {
      this.globalTopsongs = globalTopsongs;
      if (globalTopsongs) {
        this.updateForm(globalTopsongs);
      }

      this.loadRelationshipsOptions();
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

    this.songsSharedCollection = this.songService.addSongToCollectionIfMissing<ISong>(this.songsSharedCollection, globalTopsongs.song);
  }

  protected loadRelationshipsOptions(): void {
    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, this.globalTopsongs?.song)))
      .subscribe((songs: ISong[]) => (this.songsSharedCollection = songs));
  }
}
