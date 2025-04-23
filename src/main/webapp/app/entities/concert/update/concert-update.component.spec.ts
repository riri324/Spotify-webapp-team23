import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ConcertService } from '../service/concert.service';
import { IConcert } from '../concert.model';
import { ConcertFormService } from './concert-form.service';

import { ConcertUpdateComponent } from './concert-update.component';

describe('Concert Management Update Component', () => {
  let comp: ConcertUpdateComponent;
  let fixture: ComponentFixture<ConcertUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let concertFormService: ConcertFormService;
  let concertService: ConcertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConcertUpdateComponent],
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
      .overrideTemplate(ConcertUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConcertUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    concertFormService = TestBed.inject(ConcertFormService);
    concertService = TestBed.inject(ConcertService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const concert: IConcert = { id: 456 };

      activatedRoute.data = of({ concert });
      comp.ngOnInit();

      expect(comp.concert).toEqual(concert);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcert>>();
      const concert = { id: 123 };
      jest.spyOn(concertFormService, 'getConcert').mockReturnValue(concert);
      jest.spyOn(concertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concert }));
      saveSubject.complete();

      // THEN
      expect(concertFormService.getConcert).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(concertService.update).toHaveBeenCalledWith(expect.objectContaining(concert));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcert>>();
      const concert = { id: 123 };
      jest.spyOn(concertFormService, 'getConcert').mockReturnValue({ id: null });
      jest.spyOn(concertService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concert: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: concert }));
      saveSubject.complete();

      // THEN
      expect(concertFormService.getConcert).toHaveBeenCalled();
      expect(concertService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConcert>>();
      const concert = { id: 123 };
      jest.spyOn(concertService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ concert });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(concertService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
