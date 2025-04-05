import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 27630,
  playlistID: 1132,
  name: 'before diagram',
  isPublic: false,
};

export const sampleWithPartialData: IPlaylist = {
  id: 2694,
  playlistID: 31027,
  name: 'serenade mockingly granny',
  isPublic: true,
};

export const sampleWithFullData: IPlaylist = {
  id: 4255,
  playlistID: 30599,
  name: 'conclude chunter extract',
  description: 'circumnavigate',
  isPublic: true,
};

export const sampleWithNewData: NewPlaylist = {
  playlistID: 22037,
  name: 'consequently pish',
  isPublic: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
