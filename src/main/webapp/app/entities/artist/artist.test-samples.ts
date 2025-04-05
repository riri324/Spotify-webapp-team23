import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: 20248,
  artistName: 'uh-huh sunny',
  followers: 5609,
};

export const sampleWithPartialData: IArtist = {
  id: 26239,
  artistName: 'pertain',
  followers: 20255,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IArtist = {
  id: 17072,
  artistName: 'fully doubter surprisingly',
  followers: 3235,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewArtist = {
  artistName: 'who spirited',
  followers: 31544,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
