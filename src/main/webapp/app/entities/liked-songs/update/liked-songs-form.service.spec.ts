import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../liked-songs.test-samples';

import { LikedSongsFormService } from './liked-songs-form.service';

describe('LikedSongs Form Service', () => {
  let service: LikedSongsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedSongsFormService);
  });

  describe('Service methods', () => {
    describe('createLikedSongsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLikedSongsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            likeID: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });

      it('passing ILikedSongs should create a new form with FormGroup', () => {
        const formGroup = service.createLikedSongsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            likeID: expect.any(Object),
            song: expect.any(Object),
          }),
        );
      });
    });

    describe('getLikedSongs', () => {
      it('should return NewLikedSongs for default LikedSongs initial value', () => {
        const formGroup = service.createLikedSongsFormGroup(sampleWithNewData);

        const likedSongs = service.getLikedSongs(formGroup) as any;

        expect(likedSongs).toMatchObject(sampleWithNewData);
      });

      it('should return NewLikedSongs for empty LikedSongs initial value', () => {
        const formGroup = service.createLikedSongsFormGroup();

        const likedSongs = service.getLikedSongs(formGroup) as any;

        expect(likedSongs).toMatchObject({});
      });

      it('should return ILikedSongs', () => {
        const formGroup = service.createLikedSongsFormGroup(sampleWithRequiredData);

        const likedSongs = service.getLikedSongs(formGroup) as any;

        expect(likedSongs).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILikedSongs should not enable id FormControl', () => {
        const formGroup = service.createLikedSongsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLikedSongs should disable id FormControl', () => {
        const formGroup = service.createLikedSongsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
