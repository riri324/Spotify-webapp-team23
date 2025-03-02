import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { UserPreferenceService } from '../service/user-preference.service';
import { IUserPreference } from '../user-preference.model';
import { UserPreferenceFormService } from './user-preference-form.service';

import { UserPreferenceUpdateComponent } from './user-preference-update.component';

describe('UserPreference Management Update Component', () => {
  let comp: UserPreferenceUpdateComponent;
  let fixture: ComponentFixture<UserPreferenceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPreferenceFormService: UserPreferenceFormService;
  let userPreferenceService: UserPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserPreferenceUpdateComponent],
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
      .overrideTemplate(UserPreferenceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPreferenceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPreferenceFormService = TestBed.inject(UserPreferenceFormService);
    userPreferenceService = TestBed.inject(UserPreferenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const userPreference: IUserPreference = { id: 456 };

      activatedRoute.data = of({ userPreference });
      comp.ngOnInit();

      expect(comp.userPreference).toEqual(userPreference);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreference>>();
      const userPreference = { id: 123 };
      jest.spyOn(userPreferenceFormService, 'getUserPreference').mockReturnValue(userPreference);
      jest.spyOn(userPreferenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreference });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPreference }));
      saveSubject.complete();

      // THEN
      expect(userPreferenceFormService.getUserPreference).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPreferenceService.update).toHaveBeenCalledWith(expect.objectContaining(userPreference));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreference>>();
      const userPreference = { id: 123 };
      jest.spyOn(userPreferenceFormService, 'getUserPreference').mockReturnValue({ id: null });
      jest.spyOn(userPreferenceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreference: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPreference }));
      saveSubject.complete();

      // THEN
      expect(userPreferenceFormService.getUserPreference).toHaveBeenCalled();
      expect(userPreferenceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreference>>();
      const userPreference = { id: 123 };
      jest.spyOn(userPreferenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreference });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPreferenceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
