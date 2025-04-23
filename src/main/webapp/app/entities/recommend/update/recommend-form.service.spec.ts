import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../recommend.test-samples';

import { RecommendFormService } from './recommend-form.service';

describe('Recommend Form Service', () => {
  let service: RecommendFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendFormService);
  });

  describe('Service methods', () => {
    describe('createRecommendFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRecommendFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            recommendedUserId: expect.any(Object),
            commonSongsCount: expect.any(Object),
          }),
        );
      });

      it('passing IRecommend should create a new form with FormGroup', () => {
        const formGroup = service.createRecommendFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            recommendedUserId: expect.any(Object),
            commonSongsCount: expect.any(Object),
          }),
        );
      });
    });

    describe('getRecommend', () => {
      it('should return NewRecommend for default Recommend initial value', () => {
        const formGroup = service.createRecommendFormGroup(sampleWithNewData);

        const recommend = service.getRecommend(formGroup) as any;

        expect(recommend).toMatchObject(sampleWithNewData);
      });

      it('should return NewRecommend for empty Recommend initial value', () => {
        const formGroup = service.createRecommendFormGroup();

        const recommend = service.getRecommend(formGroup) as any;

        expect(recommend).toMatchObject({});
      });

      it('should return IRecommend', () => {
        const formGroup = service.createRecommendFormGroup(sampleWithRequiredData);

        const recommend = service.getRecommend(formGroup) as any;

        expect(recommend).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRecommend should not enable id FormControl', () => {
        const formGroup = service.createRecommendFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRecommend should disable id FormControl', () => {
        const formGroup = service.createRecommendFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
