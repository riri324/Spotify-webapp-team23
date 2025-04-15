import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../global-topsongs.test-samples';

import { GlobalTopsongsFormService } from './global-topsongs-form.service';

describe('GlobalTopsongs Form Service', () => {
  let service: GlobalTopsongsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalTopsongsFormService);
  });

  describe('Service methods', () => {
    describe('createGlobalTopsongsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGlobalTopsongsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            songTitle: expect.any(Object),
            artistName: expect.any(Object),
            playCount: expect.any(Object),
            monthYear: expect.any(Object),
            songYear: expect.any(Object),
          }),
        );
      });

      it('passing IGlobalTopsongs should create a new form with FormGroup', () => {
        const formGroup = service.createGlobalTopsongsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            songTitle: expect.any(Object),
            artistName: expect.any(Object),
            playCount: expect.any(Object),
            monthYear: expect.any(Object),
            songYear: expect.any(Object),
          }),
        );
      });
    });

    describe('getGlobalTopsongs', () => {
      it('should return NewGlobalTopsongs for default GlobalTopsongs initial value', () => {
        const formGroup = service.createGlobalTopsongsFormGroup(sampleWithNewData);

        const globalTopsongs = service.getGlobalTopsongs(formGroup) as any;

        expect(globalTopsongs).toMatchObject(sampleWithNewData);
      });

      it('should return NewGlobalTopsongs for empty GlobalTopsongs initial value', () => {
        const formGroup = service.createGlobalTopsongsFormGroup();

        const globalTopsongs = service.getGlobalTopsongs(formGroup) as any;

        expect(globalTopsongs).toMatchObject({});
      });

      it('should return IGlobalTopsongs', () => {
        const formGroup = service.createGlobalTopsongsFormGroup(sampleWithRequiredData);

        const globalTopsongs = service.getGlobalTopsongs(formGroup) as any;

        expect(globalTopsongs).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGlobalTopsongs should not enable id FormControl', () => {
        const formGroup = service.createGlobalTopsongsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGlobalTopsongs should disable id FormControl', () => {
        const formGroup = service.createGlobalTopsongsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
