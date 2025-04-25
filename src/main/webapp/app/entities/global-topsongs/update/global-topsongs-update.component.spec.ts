import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const globalTopsongs: IGlobalTopsongs = { id: 456 };

      activatedRoute.data = of({ globalTopsongs });
      comp.ngOnInit();

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
});
