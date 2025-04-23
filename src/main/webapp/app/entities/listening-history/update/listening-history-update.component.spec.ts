import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ISong } from 'app/entities/song/song.model';
import { SongService } from 'app/entities/song/service/song.service';
import { ListeningHistoryService } from '../service/listening-history.service';
import { IListeningHistory } from '../listening-history.model';
import { ListeningHistoryFormService } from './listening-history-form.service';

import { ListeningHistoryUpdateComponent } from './listening-history-update.component';

describe('ListeningHistory Management Update Component', () => {
  let comp: ListeningHistoryUpdateComponent;
  let fixture: ComponentFixture<ListeningHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let listeningHistoryFormService: ListeningHistoryFormService;
  let listeningHistoryService: ListeningHistoryService;
  let songService: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListeningHistoryUpdateComponent],
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
      .overrideTemplate(ListeningHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ListeningHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    listeningHistoryFormService = TestBed.inject(ListeningHistoryFormService);
    listeningHistoryService = TestBed.inject(ListeningHistoryService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Song query and add missing value', () => {
      const listeningHistory: IListeningHistory = { id: 456 };
      const songs: ISong[] = [{ id: 4856 }];
      listeningHistory.songs = songs;

      const songCollection: ISong[] = [{ id: 20137 }];
      jest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [...songs];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      jest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ listeningHistory });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(expect.objectContaining),
      );
      expect(comp.songsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const listeningHistory: IListeningHistory = { id: 456 };
      const song: ISong = { id: 26741 };
      listeningHistory.songs = [song];

      activatedRoute.data = of({ listeningHistory });
      comp.ngOnInit();

      expect(comp.songsSharedCollection).toContain(song);
      expect(comp.listeningHistory).toEqual(listeningHistory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListeningHistory>>();
      const listeningHistory = { id: 123 };
      jest.spyOn(listeningHistoryFormService, 'getListeningHistory').mockReturnValue(listeningHistory);
      jest.spyOn(listeningHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listeningHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listeningHistory }));
      saveSubject.complete();

      // THEN
      expect(listeningHistoryFormService.getListeningHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(listeningHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(listeningHistory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListeningHistory>>();
      const listeningHistory = { id: 123 };
      jest.spyOn(listeningHistoryFormService, 'getListeningHistory').mockReturnValue({ id: null });
      jest.spyOn(listeningHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listeningHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: listeningHistory }));
      saveSubject.complete();

      // THEN
      expect(listeningHistoryFormService.getListeningHistory).toHaveBeenCalled();
      expect(listeningHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IListeningHistory>>();
      const listeningHistory = { id: 123 };
      jest.spyOn(listeningHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ listeningHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(listeningHistoryService.update).toHaveBeenCalled();
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
