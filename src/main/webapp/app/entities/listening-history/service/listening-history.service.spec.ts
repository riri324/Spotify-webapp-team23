import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IListeningHistory } from '../listening-history.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../listening-history.test-samples';

import { ListeningHistoryService, RestListeningHistory } from './listening-history.service';

const requireRestSample: RestListeningHistory = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('ListeningHistory Service', () => {
  let service: ListeningHistoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IListeningHistory | IListeningHistory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ListeningHistoryService);
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

    it('should create a ListeningHistory', () => {
      const listeningHistory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(listeningHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ListeningHistory', () => {
      const listeningHistory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(listeningHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ListeningHistory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ListeningHistory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ListeningHistory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addListeningHistoryToCollectionIfMissing', () => {
      it('should add a ListeningHistory to an empty array', () => {
        const listeningHistory: IListeningHistory = sampleWithRequiredData;
        expectedResult = service.addListeningHistoryToCollectionIfMissing([], listeningHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listeningHistory);
      });

      it('should not add a ListeningHistory to an array that contains it', () => {
        const listeningHistory: IListeningHistory = sampleWithRequiredData;
        const listeningHistoryCollection: IListeningHistory[] = [
          {
            ...listeningHistory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addListeningHistoryToCollectionIfMissing(listeningHistoryCollection, listeningHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ListeningHistory to an array that doesn't contain it", () => {
        const listeningHistory: IListeningHistory = sampleWithRequiredData;
        const listeningHistoryCollection: IListeningHistory[] = [sampleWithPartialData];
        expectedResult = service.addListeningHistoryToCollectionIfMissing(listeningHistoryCollection, listeningHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listeningHistory);
      });

      it('should add only unique ListeningHistory to an array', () => {
        const listeningHistoryArray: IListeningHistory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const listeningHistoryCollection: IListeningHistory[] = [sampleWithRequiredData];
        expectedResult = service.addListeningHistoryToCollectionIfMissing(listeningHistoryCollection, ...listeningHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const listeningHistory: IListeningHistory = sampleWithRequiredData;
        const listeningHistory2: IListeningHistory = sampleWithPartialData;
        expectedResult = service.addListeningHistoryToCollectionIfMissing([], listeningHistory, listeningHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listeningHistory);
        expect(expectedResult).toContain(listeningHistory2);
      });

      it('should accept null and undefined values', () => {
        const listeningHistory: IListeningHistory = sampleWithRequiredData;
        expectedResult = service.addListeningHistoryToCollectionIfMissing([], null, listeningHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listeningHistory);
      });

      it('should return initial array if no ListeningHistory is added', () => {
        const listeningHistoryCollection: IListeningHistory[] = [sampleWithRequiredData];
        expectedResult = service.addListeningHistoryToCollectionIfMissing(listeningHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(listeningHistoryCollection);
      });
    });

    describe('compareListeningHistory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareListeningHistory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareListeningHistory(entity1, entity2);
        const compareResult2 = service.compareListeningHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareListeningHistory(entity1, entity2);
        const compareResult2 = service.compareListeningHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareListeningHistory(entity1, entity2);
        const compareResult2 = service.compareListeningHistory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
