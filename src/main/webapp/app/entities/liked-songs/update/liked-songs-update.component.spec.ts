import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { LikedSongsService } from '../service/liked-songs.service';
import { ILikedSongs } from '../liked-songs.model';
import { LikedSongsFormService } from './liked-songs-form.service';

import { LikedSongsUpdateComponent } from './liked-songs-update.component';

describe('LikedSongs Management Update Component', () => {
  let comp: LikedSongsUpdateComponent;
  let fixture: ComponentFixture<LikedSongsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let likedSongsFormService: LikedSongsFormService;
  let likedSongsService: LikedSongsService;
  let songService: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LikedSongsUpdateComponent],
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
      .overrideTemplate(LikedSongsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikedSongsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    likedSongsFormService = TestBed.inject(LikedSongsFormService);
    likedSongsService = TestBed.inject(LikedSongsService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call song query and add missing value', () => {
      const likedSongs: ILikedSongs = { id: 456 };
      const song: ISong = { id: 27984 };
      likedSongs.song = song;

      const songCollection: ISong[] = [{ id: 16281 }];
      jest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const expectedCollection: ISong[] = [song, ...songCollection];
      jest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ likedSongs });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(songCollection, song);
      expect(comp.songsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const likedSongs: ILikedSongs = { id: 456 };
      const song: ISong = { id: 23067 };
      likedSongs.song = song;

      activatedRoute.data = of({ likedSongs });
      comp.ngOnInit();

      expect(comp.songsCollection).toContain(song);
      expect(comp.likedSongs).toEqual(likedSongs);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSongs>>();
      const likedSongs = { id: 123 };
      jest.spyOn(likedSongsFormService, 'getLikedSongs').mockReturnValue(likedSongs);
      jest.spyOn(likedSongsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSongs });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedSongs }));
      saveSubject.complete();

      // THEN
      expect(likedSongsFormService.getLikedSongs).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(likedSongsService.update).toHaveBeenCalledWith(expect.objectContaining(likedSongs));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSongs>>();
      const likedSongs = { id: 123 };
      jest.spyOn(likedSongsFormService, 'getLikedSongs').mockReturnValue({ id: null });
      jest.spyOn(likedSongsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSongs: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedSongs }));
      saveSubject.complete();

      // THEN
      expect(likedSongsFormService.getLikedSongs).toHaveBeenCalled();
      expect(likedSongsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSongs>>();
      const likedSongs = { id: 123 };
      jest.spyOn(likedSongsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSongs });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(likedSongsService.update).toHaveBeenCalled();
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
