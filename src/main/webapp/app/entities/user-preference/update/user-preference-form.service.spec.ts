import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../user-preference.test-samples';

import { UserPreferenceFormService } from './user-preference-form.service';

describe('UserPreference Form Service', () => {
  let service: UserPreferenceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPreferenceFormService);
  });

  describe('Service methods', () => {
    describe('createUserPreferenceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserPreferenceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            favoriteGenre: expect.any(Object),
            musicPurpose: expect.any(Object),
            musicMood: expect.any(Object),
            vocalPreference: expect.any(Object),
            listeningTime: expect.any(Object),
            listeningPattern: expect.any(Object),
            songLength: expect.any(Object),
            lyricsImportance: expect.any(Object),
          }),
        );
      });

      it('passing IUserPreference should create a new form with FormGroup', () => {
        const formGroup = service.createUserPreferenceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            favoriteGenre: expect.any(Object),
            musicPurpose: expect.any(Object),
            musicMood: expect.any(Object),
            vocalPreference: expect.any(Object),
            listeningTime: expect.any(Object),
            listeningPattern: expect.any(Object),
            songLength: expect.any(Object),
            lyricsImportance: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserPreference', () => {
      it('should return NewUserPreference for default UserPreference initial value', () => {
        const formGroup = service.createUserPreferenceFormGroup(sampleWithNewData);

        const userPreference = service.getUserPreference(formGroup) as any;

        expect(userPreference).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserPreference for empty UserPreference initial value', () => {
        const formGroup = service.createUserPreferenceFormGroup();

        const userPreference = service.getUserPreference(formGroup) as any;

        expect(userPreference).toMatchObject({});
      });

      it('should return IUserPreference', () => {
        const formGroup = service.createUserPreferenceFormGroup(sampleWithRequiredData);

        const userPreference = service.getUserPreference(formGroup) as any;

        expect(userPreference).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserPreference should not enable id FormControl', () => {
        const formGroup = service.createUserPreferenceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserPreference should disable id FormControl', () => {
        const formGroup = service.createUserPreferenceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
