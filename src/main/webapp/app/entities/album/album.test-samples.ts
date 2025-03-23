import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: 6803,
  albumID: 10614,
  albumName: 'meh gah',
  numberOfSongs: 13185,
};

export const sampleWithPartialData: IAlbum = {
  id: 23198,
  albumID: 7761,
  albumName: 'detective contrast',
  numberOfSongs: 19394,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IAlbum = {
  id: 19762,
  albumID: 11382,
  albumName: 'gray anticodon',
  numberOfSongs: 8421,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewAlbum = {
  albumID: 15972,
  albumName: 'decode',
  numberOfSongs: 20811,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
