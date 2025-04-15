import { ILikedSongs, NewLikedSongs } from './liked-songs.model';

export const sampleWithRequiredData: ILikedSongs = {
  id: 30615,
  likeID: 25088,
};

export const sampleWithPartialData: ILikedSongs = {
  id: 22634,
  likeID: 30597,
};

export const sampleWithFullData: ILikedSongs = {
  id: 829,
  likeID: 11226,
};

export const sampleWithNewData: NewLikedSongs = {
  likeID: 14440,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
