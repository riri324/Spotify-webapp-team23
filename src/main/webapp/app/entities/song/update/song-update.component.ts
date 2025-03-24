import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { SongService } from '../service/song.service';
import { ISong } from '../song.model';
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

  albumsSharedCollection: IAlbum[] = [];
  genresSharedCollection: IGenre[] = [];
  artistsSharedCollection: IArtist[] = [];
  playlistsSharedCollection: IPlaylist[] = [];

  protected songService = inject(SongService);
  protected songFormService = inject(SongFormService);
  protected albumService = inject(AlbumService);
  protected genreService = inject(GenreService);
  protected artistService = inject(ArtistService);
  protected playlistService = inject(PlaylistService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SongFormGroup = this.songFormService.createSongFormGroup();

  compareAlbum = (o1: IAlbum | null, o2: IAlbum | null): boolean => this.albumService.compareAlbum(o1, o2);

  compareGenre = (o1: IGenre | null, o2: IGenre | null): boolean => this.genreService.compareGenre(o1, o2);

  compareArtist = (o1: IArtist | null, o2: IArtist | null): boolean => this.artistService.compareArtist(o1, o2);

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

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing<IAlbum>(this.albumsSharedCollection, song.album);
    this.genresSharedCollection = this.genreService.addGenreToCollectionIfMissing<IGenre>(this.genresSharedCollection, song.genre);
    this.artistsSharedCollection = this.artistService.addArtistToCollectionIfMissing<IArtist>(this.artistsSharedCollection, song.artist);
    this.playlistsSharedCollection = this.playlistService.addPlaylistToCollectionIfMissing<IPlaylist>(
      this.playlistsSharedCollection,
      ...(song.playlists ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.albumService
      .query()
      .pipe(map((res: HttpResponse<IAlbum[]>) => res.body ?? []))
      .pipe(map((albums: IAlbum[]) => this.albumService.addAlbumToCollectionIfMissing<IAlbum>(albums, this.song?.album)))
      .subscribe((albums: IAlbum[]) => (this.albumsSharedCollection = albums));

    this.genreService
      .query()
      .pipe(map((res: HttpResponse<IGenre[]>) => res.body ?? []))
      .pipe(map((genres: IGenre[]) => this.genreService.addGenreToCollectionIfMissing<IGenre>(genres, this.song?.genre)))
      .subscribe((genres: IGenre[]) => (this.genresSharedCollection = genres));

    this.artistService
      .query()
      .pipe(map((res: HttpResponse<IArtist[]>) => res.body ?? []))
      .pipe(map((artists: IArtist[]) => this.artistService.addArtistToCollectionIfMissing<IArtist>(artists, this.song?.artist)))
      .subscribe((artists: IArtist[]) => (this.artistsSharedCollection = artists));

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
