import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { ILikedSongs } from '../liked-songs.model';
import { LikedSongsService } from '../service/liked-songs.service';
import { LikedSongsFormGroup, LikedSongsFormService } from './liked-songs-form.service';

@Component({
  standalone: true,
  selector: 'jhi-liked-songs-update',
  templateUrl: './liked-songs-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LikedSongsUpdateComponent implements OnInit {
  isSaving = false;
  likedSongs: ILikedSongs | null = null;

  songsCollection: ISong[] = [];

  protected likedSongsService = inject(LikedSongsService);
  protected likedSongsFormService = inject(LikedSongsFormService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LikedSongsFormGroup = this.likedSongsFormService.createLikedSongsFormGroup();

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likedSongs }) => {
      this.likedSongs = likedSongs;
      if (likedSongs) {
        this.updateForm(likedSongs);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const likedSongs = this.likedSongsFormService.getLikedSongs(this.editForm);
    if (likedSongs.id !== null) {
      this.subscribeToSaveResponse(this.likedSongsService.update(likedSongs));
    } else {
      this.subscribeToSaveResponse(this.likedSongsService.create(likedSongs));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILikedSongs>>): void {
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

  protected updateForm(likedSongs: ILikedSongs): void {
    this.likedSongs = likedSongs;
    this.likedSongsFormService.resetForm(this.editForm, likedSongs);

    this.songsCollection = this.songService.addSongToCollectionIfMissing<ISong>(this.songsCollection, likedSongs.song);
  }

  protected loadRelationshipsOptions(): void {
    this.songService
      .query({ filter: 'likedsongs-is-null' })
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, this.likedSongs?.song)))
      .subscribe((songs: ISong[]) => (this.songsCollection = songs));
  }
}
