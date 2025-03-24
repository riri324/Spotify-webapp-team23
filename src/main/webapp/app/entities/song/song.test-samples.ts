import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 10261,
  songId: 'although bus',
  trackName: 'joshingly',
};

export const sampleWithPartialData: ISong = {
  id: 14934,
  songId: 'sweatshop',
  trackName: 'qua yowza',
  speechiness: 9906.4,
  acousticness: 25509.15,
  liveness: 12613.88,
  valence: 22868.73,
  tempo: 30458.71,
};

export const sampleWithFullData: ISong = {
  id: 4568,
  songId: 'crossly greedily on',
  trackName: 'only yawningly',
  danceability: 260.64,
  energy: 12692.39,
  speechiness: 11363.26,
  acousticness: 5651.25,
  instrumentalness: 7372.66,
  liveness: 28403.69,
  valence: 19430.59,
  tempo: 28531.01,
};

export const sampleWithNewData: NewSong = {
  songId: 'even over',
  trackName: 'our glittering afore',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
