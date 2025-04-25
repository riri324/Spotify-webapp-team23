import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { RecommendService } from '../service/recommend.service';
import { IRecommend } from '../recommend.model';
import { RecommendFormService } from './recommend-form.service';

import { RecommendUpdateComponent } from './recommend-update.component';

describe('Recommend Management Update Component', () => {
  let comp: RecommendUpdateComponent;
  let fixture: ComponentFixture<RecommendUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recommendFormService: RecommendFormService;
  let recommendService: RecommendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecommendUpdateComponent],
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
      .overrideTemplate(RecommendUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecommendUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recommendFormService = TestBed.inject(RecommendFormService);
    recommendService = TestBed.inject(RecommendService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const recommend: IRecommend = { id: 456 };

      activatedRoute.data = of({ recommend });
      comp.ngOnInit();

      expect(comp.recommend).toEqual(recommend);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecommend>>();
      const recommend = { id: 123 };
      jest.spyOn(recommendFormService, 'getRecommend').mockReturnValue(recommend);
      jest.spyOn(recommendService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recommend });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recommend }));
      saveSubject.complete();

      // THEN
      expect(recommendFormService.getRecommend).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(recommendService.update).toHaveBeenCalledWith(expect.objectContaining(recommend));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecommend>>();
      const recommend = { id: 123 };
      jest.spyOn(recommendFormService, 'getRecommend').mockReturnValue({ id: null });
      jest.spyOn(recommendService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recommend: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recommend }));
      saveSubject.complete();

      // THEN
      expect(recommendFormService.getRecommend).toHaveBeenCalled();
      expect(recommendService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRecommend>>();
      const recommend = { id: 123 };
      jest.spyOn(recommendService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recommend });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recommendService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
