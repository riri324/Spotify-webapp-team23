import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../listening-history.test-samples';

import { ListeningHistoryFormService } from './listening-history-form.service';

describe('ListeningHistory Form Service', () => {
  let service: ListeningHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeningHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createListeningHistoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createListeningHistoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            historyID: expect.any(Object),
            timestamp: expect.any(Object),
            songs: expect.any(Object),
          }),
        );
      });

      it('passing IListeningHistory should create a new form with FormGroup', () => {
        const formGroup = service.createListeningHistoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            historyID: expect.any(Object),
            timestamp: expect.any(Object),
            songs: expect.any(Object),
          }),
        );
      });
    });

    describe('getListeningHistory', () => {
      it('should return NewListeningHistory for default ListeningHistory initial value', () => {
        const formGroup = service.createListeningHistoryFormGroup(sampleWithNewData);

        const listeningHistory = service.getListeningHistory(formGroup) as any;

        expect(listeningHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewListeningHistory for empty ListeningHistory initial value', () => {
        const formGroup = service.createListeningHistoryFormGroup();

        const listeningHistory = service.getListeningHistory(formGroup) as any;

        expect(listeningHistory).toMatchObject({});
      });

      it('should return IListeningHistory', () => {
        const formGroup = service.createListeningHistoryFormGroup(sampleWithRequiredData);

        const listeningHistory = service.getListeningHistory(formGroup) as any;

        expect(listeningHistory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IListeningHistory should not enable id FormControl', () => {
        const formGroup = service.createListeningHistoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewListeningHistory should disable id FormControl', () => {
        const formGroup = service.createListeningHistoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
