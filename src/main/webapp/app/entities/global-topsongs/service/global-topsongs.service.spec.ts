import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGlobalTopsongs } from '../global-topsongs.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../global-topsongs.test-samples';

import { GlobalTopsongsService, RestGlobalTopsongs } from './global-topsongs.service';

const requireRestSample: RestGlobalTopsongs = {
  ...sampleWithRequiredData,
  monthYear: sampleWithRequiredData.monthYear?.toJSON(),
};

describe('GlobalTopsongs Service', () => {
  let service: GlobalTopsongsService;
  let httpMock: HttpTestingController;
  let expectedResult: IGlobalTopsongs | IGlobalTopsongs[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GlobalTopsongsService);
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

    it('should create a GlobalTopsongs', () => {
      const globalTopsongs = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(globalTopsongs).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GlobalTopsongs', () => {
      const globalTopsongs = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(globalTopsongs).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GlobalTopsongs', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GlobalTopsongs', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GlobalTopsongs', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGlobalTopsongsToCollectionIfMissing', () => {
      it('should add a GlobalTopsongs to an empty array', () => {
        const globalTopsongs: IGlobalTopsongs = sampleWithRequiredData;
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing([], globalTopsongs);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(globalTopsongs);
      });

      it('should not add a GlobalTopsongs to an array that contains it', () => {
        const globalTopsongs: IGlobalTopsongs = sampleWithRequiredData;
        const globalTopsongsCollection: IGlobalTopsongs[] = [
          {
            ...globalTopsongs,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing(globalTopsongsCollection, globalTopsongs);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GlobalTopsongs to an array that doesn't contain it", () => {
        const globalTopsongs: IGlobalTopsongs = sampleWithRequiredData;
        const globalTopsongsCollection: IGlobalTopsongs[] = [sampleWithPartialData];
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing(globalTopsongsCollection, globalTopsongs);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(globalTopsongs);
      });

      it('should add only unique GlobalTopsongs to an array', () => {
        const globalTopsongsArray: IGlobalTopsongs[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const globalTopsongsCollection: IGlobalTopsongs[] = [sampleWithRequiredData];
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing(globalTopsongsCollection, ...globalTopsongsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const globalTopsongs: IGlobalTopsongs = sampleWithRequiredData;
        const globalTopsongs2: IGlobalTopsongs = sampleWithPartialData;
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing([], globalTopsongs, globalTopsongs2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(globalTopsongs);
        expect(expectedResult).toContain(globalTopsongs2);
      });

      it('should accept null and undefined values', () => {
        const globalTopsongs: IGlobalTopsongs = sampleWithRequiredData;
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing([], null, globalTopsongs, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(globalTopsongs);
      });

      it('should return initial array if no GlobalTopsongs is added', () => {
        const globalTopsongsCollection: IGlobalTopsongs[] = [sampleWithRequiredData];
        expectedResult = service.addGlobalTopsongsToCollectionIfMissing(globalTopsongsCollection, undefined, null);
        expect(expectedResult).toEqual(globalTopsongsCollection);
      });
    });

    describe('compareGlobalTopsongs', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGlobalTopsongs(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGlobalTopsongs(entity1, entity2);
        const compareResult2 = service.compareGlobalTopsongs(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGlobalTopsongs(entity1, entity2);
        const compareResult2 = service.compareGlobalTopsongs(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGlobalTopsongs(entity1, entity2);
        const compareResult2 = service.compareGlobalTopsongs(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
