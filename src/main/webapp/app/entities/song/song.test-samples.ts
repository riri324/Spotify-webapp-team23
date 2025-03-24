import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 20013,
  trackId: 'upwardly',
};

export const sampleWithPartialData: ISong = {
  id: 7422,
  trackId: 'now',
  trackName: 'glimmer mousse thrifty',
  valence: 20797.43,
  trackGenre: 'secret',
};

export const sampleWithFullData: ISong = {
  id: 16027,
  trackId: 'hateful considering even',
  artists: 'stake',
  albumName: 'pivot pfft ingratiate',
  trackName: 'splurge as misreport',
  danceability: 20664.74,
  energy: 31147.99,
  speechiness: 24767.03,
  acousticness: 24109.78,
  instrumentalness: 17122.28,
  liveness: 24207.83,
  valence: 10959.9,
  tempo: 9605.56,
  trackGenre: 'woefully eyeglasses ouch',
};

export const sampleWithNewData: NewSong = {
  trackId: 'nor catalyze adviser',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
