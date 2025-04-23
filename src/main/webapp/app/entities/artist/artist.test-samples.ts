import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: 9002,
  artistName: 'tightly',
  followers: 26232,
};

export const sampleWithPartialData: IArtist = {
  id: 4101,
  artistName: 'shampoo',
  followers: 26507,
};

export const sampleWithFullData: IArtist = {
  id: 17933,
  artistName: 'curiously yuck',
  followers: 31026,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewArtist = {
  artistName: 'yawningly except',
  followers: 11950,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
