import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { ISong } from '../song.model';
import { SongService } from '../service/song.service';
import { SongFormGroup, SongFormService } from './song-form.service';

@Component({
  standalone: true,
  selector: 'jhi-song-update',
  templateUrl: './song-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SongUpdateComponent implements OnInit {
  isSaving = false;
  song: ISong | null = null;

  playlistsSharedCollection: IPlaylist[] = [];

  protected songService = inject(SongService);
  protected songFormService = inject(SongFormService);
  protected playlistService = inject(PlaylistService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SongFormGroup = this.songFormService.createSongFormGroup();

  comparePlaylist = (o1: IPlaylist | null, o2: IPlaylist | null): boolean => this.playlistService.comparePlaylist(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ song }) => {
      this.song = song;
      if (song) {
        this.updateForm(song);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const song = this.songFormService.getSong(this.editForm);
    if (song.id !== null) {
      this.subscribeToSaveResponse(this.songService.update(song));
    } else {
      this.subscribeToSaveResponse(this.songService.create(song));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISong>>): void {
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

  protected updateForm(song: ISong): void {
    this.song = song;
    this.songFormService.resetForm(this.editForm, song);

    this.playlistsSharedCollection = this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(
      this.playlistsSharedCollection,
      ...(song.playlists ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.playlistService
      .query()
      .pipe(map((res: HttpResponse<IPlaylist[]>) => res.body ?? []))
      .pipe(
        map((playlists: IPlaylist[]) =>
          this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(playlists, ...(this.song?.playlists ?? [])),
        ),
      )
      .subscribe((playlists: IPlaylist[]) => (this.playlistsSharedCollection = playlists));
  }
}
