import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRecommend } from '../recommend.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../recommend.test-samples';

import { RecommendService } from './recommend.service';

const requireRestSample: IRecommend = {
  ...sampleWithRequiredData,
};

describe('Recommend Service', () => {
  let service: RecommendService;
  let httpMock: HttpTestingController;
  let expectedResult: IRecommend | IRecommend[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RecommendService);
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

    it('should create a Recommend', () => {
      const recommend = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(recommend).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Recommend', () => {
      const recommend = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(recommend).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Recommend', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Recommend', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Recommend', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRecommendToCollectionIfMissing', () => {
      it('should add a Recommend to an empty array', () => {
        const recommend: IRecommend = sampleWithRequiredData;
        expectedResult = service.addRecommendToCollectionIfMissing([], recommend);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recommend);
      });

      it('should not add a Recommend to an array that contains it', () => {
        const recommend: IRecommend = sampleWithRequiredData;
        const recommendCollection: IRecommend[] = [
          {
            ...recommend,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRecommendToCollectionIfMissing(recommendCollection, recommend);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Recommend to an array that doesn't contain it", () => {
        const recommend: IRecommend = sampleWithRequiredData;
        const recommendCollection: IRecommend[] = [sampleWithPartialData];
        expectedResult = service.addRecommendToCollectionIfMissing(recommendCollection, recommend);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recommend);
      });

      it('should add only unique Recommend to an array', () => {
        const recommendArray: IRecommend[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const recommendCollection: IRecommend[] = [sampleWithRequiredData];
        expectedResult = service.addRecommendToCollectionIfMissing(recommendCollection, ...recommendArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const recommend: IRecommend = sampleWithRequiredData;
        const recommend2: IRecommend = sampleWithPartialData;
        expectedResult = service.addRecommendToCollectionIfMissing([], recommend, recommend2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recommend);
        expect(expectedResult).toContain(recommend2);
      });

      it('should accept null and undefined values', () => {
        const recommend: IRecommend = sampleWithRequiredData;
        expectedResult = service.addRecommendToCollectionIfMissing([], null, recommend, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recommend);
      });

      it('should return initial array if no Recommend is added', () => {
        const recommendCollection: IRecommend[] = [sampleWithRequiredData];
        expectedResult = service.addRecommendToCollectionIfMissing(recommendCollection, undefined, null);
        expect(expectedResult).toEqual(recommendCollection);
      });
    });

    describe('compareRecommend', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRecommend(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRecommend(entity1, entity2);
        const compareResult2 = service.compareRecommend(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRecommend(entity1, entity2);
        const compareResult2 = service.compareRecommend(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRecommend(entity1, entity2);
        const compareResult2 = service.compareRecommend(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
