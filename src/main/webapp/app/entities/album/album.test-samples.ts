import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: 23672,
  albumID: 5069,
  albumName: 'zowie plus',
  numberOfSongs: 9450,
};

export const sampleWithPartialData: IAlbum = {
  id: 899,
  albumID: 24408,
  albumName: 'live because consequently',
  numberOfSongs: 463,
};

export const sampleWithFullData: IAlbum = {
  id: 4526,
  albumID: 31199,
  albumName: 'down',
  numberOfSongs: 24248,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewAlbum = {
  albumID: 14413,
  albumName: 'giant unique',
  numberOfSongs: 30637,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
