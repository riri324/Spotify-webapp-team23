import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: 28237,
  artistName: 'over',
  followers: 15336,
};

export const sampleWithPartialData: IArtist = {
  id: 27365,
  artistName: 'mosh while',
  followers: 31944,
};

export const sampleWithFullData: IArtist = {
  id: 2812,
  artistName: 'that unimpressively flustered',
  followers: 21565,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewArtist = {
  artistName: 'thread',
  followers: 11740,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
