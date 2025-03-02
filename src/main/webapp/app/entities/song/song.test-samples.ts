import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 24435,
  trackId: 'welcome',
};

export const sampleWithPartialData: ISong = {
  id: 29343,
  trackId: 'browse absent',
  artists: 'certainly costume contrail',
  danceability: 339.65,
  speechiness: 17759.02,
  instrumentalness: 2438.98,
};

export const sampleWithFullData: ISong = {
  id: 11875,
  trackId: 'elevation',
  artists: 'onto ugh',
  albumName: 'bah',
  trackName: 'velocity attend',
  danceability: 31723.71,
  energy: 7240.67,
  speechiness: 10083.21,
  acousticness: 6608.8,
  instrumentalness: 8523.4,
  liveness: 29469.48,
  valence: 22505.88,
  tempo: 5934.12,
  trackGenre: 'accessorise',
};

export const sampleWithNewData: NewSong = {
  trackId: 'acceptable er unless',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
