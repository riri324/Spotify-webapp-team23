import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';
import { IGenre } from 'app/entities/genre/genre.model';
import { GenreService } from 'app/entities/genre/service/genre.service';
import { IArtist } from 'app/entities/artist/artist.model';
import { ArtistService } from 'app/entities/artist/service/artist.service';
import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { ISong } from '../song.model';
import { SongService } from '../service/song.service';
import { SongFormService } from './song-form.service';

import { SongUpdateComponent } from './song-update.component';

describe('Song Management Update Component', () => {
  let comp: SongUpdateComponent;
  let fixture: ComponentFixture<SongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let songFormService: SongFormService;
  let songService: SongService;
  let albumService: AlbumService;
  let genreService: GenreService;
  let artistService: ArtistService;
  let playlistService: PlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SongUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SongUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SongUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    songFormService = TestBed.inject(SongFormService);
    songService = TestBed.inject(SongService);
    albumService = TestBed.inject(AlbumService);
    genreService = TestBed.inject(GenreService);
    artistService = TestBed.inject(ArtistService);
    playlistService = TestBed.inject(PlaylistService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Album query and add missing value', () => {
      const song: ISong = { id: 456 };
      const album: IAlbum = { id: 14819 };
      song.album = album;

      const albumCollection: IAlbum[] = [{ id: 31753 }];
      jest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [album];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      jest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(
        albumCollection,
        ...additionalAlbums.map(expect.objectContaining),
      );
      expect(comp.albumsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Genre query and add missing value', () => {
      const song: ISong = { id: 456 };
      const genre: IGenre = { id: 11553 };
      song.genre = genre;

      const genreCollection: IGenre[] = [{ id: 18390 }];
      jest.spyOn(genreService, 'query').mockReturnValue(of(new HttpResponse({ body: genreCollection })));
      const additionalGenres = [genre];
      const expectedCollection: IGenre[] = [...additionalGenres, ...genreCollection];
      jest.spyOn(genreService, 'addGenreToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(genreService.query).toHaveBeenCalled();
      expect(genreService.addGenreToCollectionIfMissing).toHaveBeenCalledWith(
        genreCollection,
        ...additionalGenres.map(expect.objectContaining),
      );
      expect(comp.genresSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Artist query and add missing value', () => {
      const song: ISong = { id: 456 };
      const artist: IArtist = { id: 19709 };
      song.artist = artist;

      const artistCollection: IArtist[] = [{ id: 28751 }];
      jest.spyOn(artistService, 'query').mockReturnValue(of(new HttpResponse({ body: artistCollection })));
      const additionalArtists = [artist];
      const expectedCollection: IArtist[] = [...additionalArtists, ...artistCollection];
      jest.spyOn(artistService, 'addArtistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(artistService.query).toHaveBeenCalled();
      expect(artistService.addArtistToCollectionIfMissing).toHaveBeenCalledWith(
        artistCollection,
        ...additionalArtists.map(expect.objectContaining),
      );
      expect(comp.artistsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Playlist query and add missing value', () => {
      const song: ISong = { id: 456 };
      const playlists: IPlaylist[] = [{ id: 12477 }];
      song.playlists = playlists;

      const playlistCollection: IPlaylist[] = [{ id: 7677 }];
      jest.spyOn(playlistService, 'query').mockReturnValue(of(new HttpResponse({ body: playlistCollection })));
      const additionalPlaylists = [...playlists];
      const expectedCollection: IPlaylist[] = [...additionalPlaylists, ...playlistCollection];
      jest.spyOn(playlistService, 'addPlaylistToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(playlistService.query).toHaveBeenCalled();
      expect(playlistService.addPlaylistToCollectionIfMissing).toHaveBeenCalledWith(
        playlistCollection,
        ...additionalPlaylists.map(expect.objectContaining),
      );
      expect(comp.playlistsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const song: ISong = { id: 456 };
      const album: IAlbum = { id: 15380 };
      song.album = album;
      const genre: IGenre = { id: 23525 };
      song.genre = genre;
      const artist: IArtist = { id: 9549 };
      song.artist = artist;
      const playlists: IPlaylist = { id: 23528 };
      song.playlists = [playlists];

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(comp.albumsSharedCollection).toContain(album);
      expect(comp.genresSharedCollection).toContain(genre);
      expect(comp.artistsSharedCollection).toContain(artist);
      expect(comp.playlistsSharedCollection).toContain(playlists);
      expect(comp.song).toEqual(song);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 123 };
      jest.spyOn(songFormService, 'getSong').mockReturnValue(song);
      jest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: song }));
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(songService.update).toHaveBeenCalledWith(expect.objectContaining(song));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 123 };
      jest.spyOn(songFormService, 'getSong').mockReturnValue({ id: null });
      jest.spyOn(songService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: song }));
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(songService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 123 };
      jest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(songService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAlbum', () => {
      it('Should forward to albumService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(albumService, 'compareAlbum');
        comp.compareAlbum(entity, entity2);
        expect(albumService.compareAlbum).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGenre', () => {
      it('Should forward to genreService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(genreService, 'compareGenre');
        comp.compareGenre(entity, entity2);
        expect(genreService.compareGenre).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareArtist', () => {
      it('Should forward to artistService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(artistService, 'compareArtist');
        comp.compareArtist(entity, entity2);
        expect(artistService.compareArtist).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePlaylist', () => {
      it('Should forward to playlistService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(playlistService, 'comparePlaylist');
        comp.comparePlaylist(entity, entity2);
        expect(playlistService.comparePlaylist).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
