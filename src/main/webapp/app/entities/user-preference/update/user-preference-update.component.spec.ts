import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
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
  let userService: UserService;

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
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userPreference: IUserPreference = { id: 456 };
      const user: IUser = { id: 6213 };
      userPreference.user = user;

      const userCollection: IUser[] = [{ id: 22834 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPreference });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userPreference: IUserPreference = { id: 456 };
      const user: IUser = { id: 29087 };
      userPreference.user = user;

      activatedRoute.data = of({ userPreference });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
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

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
