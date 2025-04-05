import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 8806,
  songId: 'mobilise er',
  trackName: 'aboard the fooey',
};

export const sampleWithPartialData: ISong = {
  id: 28620,
  songId: 'immediate',
  trackName: 'zen wearily',
  danceability: 24302,
  energy: 2639.83,
  speechiness: 21683.91,
  instrumentalness: 27606.74,
  tempo: 15573.87,
};

export const sampleWithFullData: ISong = {
  id: 13816,
  songId: 'draft adventurously',
  trackName: 'ad fledgling incidentally',
  danceability: 14271.91,
  energy: 13466.99,
  speechiness: 28490.09,
  acousticness: 3424.23,
  instrumentalness: 24465.21,
  liveness: 10293.81,
  valence: 4455.62,
  tempo: 18398.18,
};

export const sampleWithNewData: NewSong = {
  songId: 'antagonize gadzooks pace',
  trackName: 'oxygenate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
