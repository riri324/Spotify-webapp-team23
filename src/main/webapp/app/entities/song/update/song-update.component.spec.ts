import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { PlaylistService } from 'app/entities/playlist/service/playlist.service';
import { SongService } from '../service/song.service';
import { ISong } from '../song.model';
import { SongFormService } from './song-form.service';

import { SongUpdateComponent } from './song-update.component';

describe('Song Management Update Component', () => {
  let comp: SongUpdateComponent;
  let fixture: ComponentFixture<SongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let songFormService: SongFormService;
  let songService: SongService;
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
    playlistService = TestBed.inject(PlaylistService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Playlist query and add missing value', () => {
      const song: ISong = { id: 456 };
      const playlists: IPlaylist[] = [{ id: 2268 }];
      song.playlists = playlists;

      const playlistCollection: IPlaylist[] = [{ id: 30678 }];
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
      const playlists: IPlaylist = { id: 17542 };
      song.playlists = [playlists];

      activatedRoute.data = of({ song });
      comp.ngOnInit();

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
