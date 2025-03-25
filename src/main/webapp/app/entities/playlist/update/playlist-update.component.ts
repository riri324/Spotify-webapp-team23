import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { PlaylistService } from '../service/playlist.service';
import { IPlaylist } from '../playlist.model';
import { PlaylistFormGroup, PlaylistFormService } from './playlist-form.service';

@Component({
  standalone: true,
  selector: 'jhi-playlist-update',
  templateUrl: './playlist-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PlaylistUpdateComponent implements OnInit {
  isSaving = false;
  playlist: IPlaylist | null = null;

  usersSharedCollection: IUser[] = [];
  songsSharedCollection: ISong[] = [];

  protected playlistService = inject(PlaylistService);
  protected playlistFormService = inject(PlaylistFormService);
  protected userService = inject(UserService);
  protected songService = inject(SongService);
  protected activatedRoute = inject(ActivatedRoute);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PlaylistFormGroup = this.playlistFormService.createPlaylistFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareSong = (o1: ISong | null, o2: ISong | null): boolean => this.songService.compareSong(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ playlist }) => {
      this.playlist = playlist;
      if (playlist) {
        this.updateForm(playlist);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const playlist = this.playlistFormService.getPlaylist(this.editForm);
    if (playlist.id !== null) {
      this.subscribeToSaveResponse(this.playlistService.update(playlist));
    } else {
      this.subscribeToSaveResponse(this.playlistService.create(playlist));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaylist>>): void {
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

  protected updateForm(playlist: IPlaylist): void {
    this.playlist = playlist;
    this.playlistFormService.resetForm(this.editForm, playlist);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, playlist.user);
    this.songsSharedCollection = this.songService.addSongToCollectionIfMissing<ISong>(
      this.songsSharedCollection,
      ...(playlist.songs ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.playlist?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.songService
      .query()
      .pipe(map((res: HttpResponse<ISong[]>) => res.body ?? []))
      .pipe(map((songs: ISong[]) => this.songService.addSongToCollectionIfMissing<ISong>(songs, ...(this.playlist?.songs ?? []))))
      .subscribe((songs: ISong[]) => (this.songsSharedCollection = songs));
  }
}
