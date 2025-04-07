import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { GlobalTopsongsService } from '../service/global-topsongs.service';
import { IGlobalTopsongs } from '../global-topsongs.model';
import { GlobalTopsongsFormService } from './global-topsongs-form.service';

import { GlobalTopsongsUpdateComponent } from './global-topsongs-update.component';

describe('GlobalTopsongs Management Update Component', () => {
  let comp: GlobalTopsongsUpdateComponent;
  let fixture: ComponentFixture<GlobalTopsongsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let globalTopsongsFormService: GlobalTopsongsFormService;
  let globalTopsongsService: GlobalTopsongsService;
  let songService: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobalTopsongsUpdateComponent],
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
      .overrideTemplate(GlobalTopsongsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GlobalTopsongsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    globalTopsongsFormService = TestBed.inject(GlobalTopsongsFormService);
    globalTopsongsService = TestBed.inject(GlobalTopsongsService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Song query and add missing value', () => {
      const globalTopsongs: IGlobalTopsongs = { id: 456 };
      const song: ISong = { id: 5593 };
      globalTopsongs.song = song;

      const songCollection: ISong[] = [{ id: 20252 }];
      jest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [song];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      jest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ globalTopsongs });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(expect.objectContaining),
      );
      expect(comp.songsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const globalTopsongs: IGlobalTopsongs = { id: 456 };
      const song: ISong = { id: 8828 };
      globalTopsongs.song = song;

      activatedRoute.data = of({ globalTopsongs });
      comp.ngOnInit();

      expect(comp.songsSharedCollection).toContain(song);
      expect(comp.globalTopsongs).toEqual(globalTopsongs);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalTopsongs>>();
      const globalTopsongs = { id: 123 };
      jest.spyOn(globalTopsongsFormService, 'getGlobalTopsongs').mockReturnValue(globalTopsongs);
      jest.spyOn(globalTopsongsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalTopsongs });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: globalTopsongs }));
      saveSubject.complete();

      // THEN
      expect(globalTopsongsFormService.getGlobalTopsongs).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(globalTopsongsService.update).toHaveBeenCalledWith(expect.objectContaining(globalTopsongs));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalTopsongs>>();
      const globalTopsongs = { id: 123 };
      jest.spyOn(globalTopsongsFormService, 'getGlobalTopsongs').mockReturnValue({ id: null });
      jest.spyOn(globalTopsongsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalTopsongs: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: globalTopsongs }));
      saveSubject.complete();

      // THEN
      expect(globalTopsongsFormService.getGlobalTopsongs).toHaveBeenCalled();
      expect(globalTopsongsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalTopsongs>>();
      const globalTopsongs = { id: 123 };
      jest.spyOn(globalTopsongsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalTopsongs });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(globalTopsongsService.update).toHaveBeenCalled();
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
