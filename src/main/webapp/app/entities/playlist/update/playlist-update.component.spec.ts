import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { PlaylistService } from '../service/playlist.service';
import { IPlaylist } from '../playlist.model';
import { PlaylistFormService } from './playlist-form.service';

import { PlaylistUpdateComponent } from './playlist-update.component';

describe('Playlist Management Update Component', () => {
  let comp: PlaylistUpdateComponent;
  let fixture: ComponentFixture<PlaylistUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let playlistFormService: PlaylistFormService;
  let playlistService: PlaylistService;
  let songService: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PlaylistUpdateComponent],
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
      .overrideTemplate(PlaylistUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlaylistUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    playlistFormService = TestBed.inject(PlaylistFormService);
    playlistService = TestBed.inject(PlaylistService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Song query and add missing value', () => {
      const playlist: IPlaylist = { id: 456 };
      const songs: ISong[] = [{ id: 6404 }];
      playlist.songs = songs;

      const songCollection: ISong[] = [{ id: 10877 }];
      jest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [...songs];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      jest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ playlist });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(expect.objectContaining),
      );
      expect(comp.songsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const playlist: IPlaylist = { id: 456 };
      const songs: ISong = { id: 14023 };
      playlist.songs = [songs];

      activatedRoute.data = of({ playlist });
      comp.ngOnInit();

      expect(comp.songsSharedCollection).toContain(songs);
      expect(comp.playlist).toEqual(playlist);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlaylist>>();
      const playlist = { id: 123 };
      jest.spyOn(playlistFormService, 'getPlaylist').mockReturnValue(playlist);
      jest.spyOn(playlistService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: playlist }));
      saveSubject.complete();

      // THEN
      expect(playlistFormService.getPlaylist).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(playlistService.update).toHaveBeenCalledWith(expect.objectContaining(playlist));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlaylist>>();
      const playlist = { id: 123 };
      jest.spyOn(playlistFormService, 'getPlaylist').mockReturnValue({ id: null });
      jest.spyOn(playlistService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlist: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: playlist }));
      saveSubject.complete();

      // THEN
      expect(playlistFormService.getPlaylist).toHaveBeenCalled();
      expect(playlistService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlaylist>>();
      const playlist = { id: 123 };
      jest.spyOn(playlistService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ playlist });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(playlistService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSong', () => {
      it('Should forward to songService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(songService, 'compareSong');
        comp.compareSong(entity, entity2);
        expect(songService.compareSong).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
