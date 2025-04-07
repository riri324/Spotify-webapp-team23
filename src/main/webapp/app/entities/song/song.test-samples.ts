import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 8791,
  songId: 'apostrophize as enhance',
  trackName: 'gratefully mmm',
};

export const sampleWithPartialData: ISong = {
  id: 8969,
  songId: 'fiddle upbeat modulo',
  trackName: 'hence wedding spectate',
};

export const sampleWithFullData: ISong = {
  id: 20860,
  songId: 'alert forage',
  trackName: 'duh',
  danceability: 15164.23,
  energy: 16173.89,
  speechiness: 18401.53,
  acousticness: 16517.97,
  instrumentalness: 7383.98,
  liveness: 14960.68,
  valence: 12435.33,
  tempo: 5414.76,
};

export const sampleWithNewData: NewSong = {
  songId: 'finally hydrant',
  trackName: 'zowie flash worldly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
