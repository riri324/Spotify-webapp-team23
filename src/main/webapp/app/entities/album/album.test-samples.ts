import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: 6680,
  albumID: 16006,
  albumName: 'around',
  numberOfSongs: 2058,
};

export const sampleWithPartialData: IAlbum = {
  id: 26791,
  albumID: 20409,
  albumName: 'king',
  numberOfSongs: 6682,
};

export const sampleWithFullData: IAlbum = {
  id: 9192,
  albumID: 31188,
  albumName: 'serve since lieu',
  numberOfSongs: 30276,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewAlbum = {
  albumID: 31383,
  albumName: 'now joint modulo',
  numberOfSongs: 13816,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
