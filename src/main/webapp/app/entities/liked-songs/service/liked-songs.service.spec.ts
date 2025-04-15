import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ILikedSongs } from '../liked-songs.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../liked-songs.test-samples';

import { LikedSongsService } from './liked-songs.service';

const requireRestSample: ILikedSongs = {
  ...sampleWithRequiredData,
};

describe('LikedSongs Service', () => {
  let service: LikedSongsService;
  let httpMock: HttpTestingController;
  let expectedResult: ILikedSongs | ILikedSongs[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LikedSongsService);
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

    it('should create a LikedSongs', () => {
      const likedSongs = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(likedSongs).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LikedSongs', () => {
      const likedSongs = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(likedSongs).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LikedSongs', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LikedSongs', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LikedSongs', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLikedSongsToCollectionIfMissing', () => {
      it('should add a LikedSongs to an empty array', () => {
        const likedSongs: ILikedSongs = sampleWithRequiredData;
        expectedResult = service.addLikedSongsToCollectionIfMissing([], likedSongs);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likedSongs);
      });

      it('should not add a LikedSongs to an array that contains it', () => {
        const likedSongs: ILikedSongs = sampleWithRequiredData;
        const likedSongsCollection: ILikedSongs[] = [
          {
            ...likedSongs,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLikedSongsToCollectionIfMissing(likedSongsCollection, likedSongs);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LikedSongs to an array that doesn't contain it", () => {
        const likedSongs: ILikedSongs = sampleWithRequiredData;
        const likedSongsCollection: ILikedSongs[] = [sampleWithPartialData];
        expectedResult = service.addLikedSongsToCollectionIfMissing(likedSongsCollection, likedSongs);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likedSongs);
      });

      it('should add only unique LikedSongs to an array', () => {
        const likedSongsArray: ILikedSongs[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const likedSongsCollection: ILikedSongs[] = [sampleWithRequiredData];
        expectedResult = service.addLikedSongsToCollectionIfMissing(likedSongsCollection, ...likedSongsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const likedSongs: ILikedSongs = sampleWithRequiredData;
        const likedSongs2: ILikedSongs = sampleWithPartialData;
        expectedResult = service.addLikedSongsToCollectionIfMissing([], likedSongs, likedSongs2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likedSongs);
        expect(expectedResult).toContain(likedSongs2);
      });

      it('should accept null and undefined values', () => {
        const likedSongs: ILikedSongs = sampleWithRequiredData;
        expectedResult = service.addLikedSongsToCollectionIfMissing([], null, likedSongs, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likedSongs);
      });

      it('should return initial array if no LikedSongs is added', () => {
        const likedSongsCollection: ILikedSongs[] = [sampleWithRequiredData];
        expectedResult = service.addLikedSongsToCollectionIfMissing(likedSongsCollection, undefined, null);
        expect(expectedResult).toEqual(likedSongsCollection);
      });
    });

    describe('compareLikedSongs', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLikedSongs(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLikedSongs(entity1, entity2);
        const compareResult2 = service.compareLikedSongs(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLikedSongs(entity1, entity2);
        const compareResult2 = service.compareLikedSongs(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLikedSongs(entity1, entity2);
        const compareResult2 = service.compareLikedSongs(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
