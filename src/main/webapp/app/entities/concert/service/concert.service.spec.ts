import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IConcert } from '../concert.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../concert.test-samples';

import { ConcertService, RestConcert } from './concert.service';

const requireRestSample: RestConcert = {
  ...sampleWithRequiredData,
  eventDate: sampleWithRequiredData.eventDate?.toJSON(),
};

describe('Concert Service', () => {
  let service: ConcertService;
  let httpMock: HttpTestingController;
  let expectedResult: IConcert | IConcert[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ConcertService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Concert', () => {
      const concert = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(concert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Concert', () => {
      const concert = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(concert).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Concert', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Concert', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Concert', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConcertToCollectionIfMissing', () => {
      it('should add a Concert to an empty array', () => {
        const concert: IConcert = sampleWithRequiredData;
        expectedResult = service.addConcertToCollectionIfMissing([], concert);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concert);
      });

      it('should not add a Concert to an array that contains it', () => {
        const concert: IConcert = sampleWithRequiredData;
        const concertCollection: IConcert[] = [
          {
            ...concert,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConcertToCollectionIfMissing(concertCollection, concert);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Concert to an array that doesn't contain it", () => {
        const concert: IConcert = sampleWithRequiredData;
        const concertCollection: IConcert[] = [sampleWithPartialData];
        expectedResult = service.addConcertToCollectionIfMissing(concertCollection, concert);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concert);
      });

      it('should add only unique Concert to an array', () => {
        const concertArray: IConcert[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const concertCollection: IConcert[] = [sampleWithRequiredData];
        expectedResult = service.addConcertToCollectionIfMissing(concertCollection, ...concertArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const concert: IConcert = sampleWithRequiredData;
        const concert2: IConcert = sampleWithPartialData;
        expectedResult = service.addConcertToCollectionIfMissing([], concert, concert2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(concert);
        expect(expectedResult).toContain(concert2);
      });

      it('should accept null and undefined values', () => {
        const concert: IConcert = sampleWithRequiredData;
        expectedResult = service.addConcertToCollectionIfMissing([], null, concert, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(concert);
      });

      it('should return initial array if no Concert is added', () => {
        const concertCollection: IConcert[] = [sampleWithRequiredData];
        expectedResult = service.addConcertToCollectionIfMissing(concertCollection, undefined, null);
        expect(expectedResult).toEqual(concertCollection);
      });
    });

    describe('compareConcert', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConcert(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConcert(entity1, entity2);
        const compareResult2 = service.compareConcert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConcert(entity1, entity2);
        const compareResult2 = service.compareConcert(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConcert(entity1, entity2);
        const compareResult2 = service.compareConcert(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
