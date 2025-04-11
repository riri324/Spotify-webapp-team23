import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../concert.test-samples';

import { ConcertFormService } from './concert-form.service';

describe('Concert Form Service', () => {
  let service: ConcertFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcertFormService);
  });

  describe('Service methods', () => {
    describe('createConcertFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConcertFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            artistName: expect.any(Object),
            venueName: expect.any(Object),
            country: expect.any(Object),
            region: expect.any(Object),
            eventDate: expect.any(Object),
            ticketmasterEventId: expect.any(Object),
            imageUrl: expect.any(Object),
            externalUrl: expect.any(Object),
          }),
        );
      });

      it('passing IConcert should create a new form with FormGroup', () => {
        const formGroup = service.createConcertFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            artistName: expect.any(Object),
            venueName: expect.any(Object),
            country: expect.any(Object),
            region: expect.any(Object),
            eventDate: expect.any(Object),
            ticketmasterEventId: expect.any(Object),
            imageUrl: expect.any(Object),
            externalUrl: expect.any(Object),
          }),
        );
      });
    });

    describe('getConcert', () => {
      it('should return NewConcert for default Concert initial value', () => {
        const formGroup = service.createConcertFormGroup(sampleWithNewData);

        const concert = service.getConcert(formGroup) as any;

        expect(concert).toMatchObject(sampleWithNewData);
      });

      it('should return NewConcert for empty Concert initial value', () => {
        const formGroup = service.createConcertFormGroup();

        const concert = service.getConcert(formGroup) as any;

        expect(concert).toMatchObject({});
      });

      it('should return IConcert', () => {
        const formGroup = service.createConcertFormGroup(sampleWithRequiredData);

        const concert = service.getConcert(formGroup) as any;

        expect(concert).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConcert should not enable id FormControl', () => {
        const formGroup = service.createConcertFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConcert should disable id FormControl', () => {
        const formGroup = service.createConcertFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
