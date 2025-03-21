import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 32249,
  playlistID: 18411,
  name: 'dreamily',
  isPublic: false,
};

export const sampleWithPartialData: IPlaylist = {
  id: 28270,
  playlistID: 9469,
  name: 'whereas rag circa',
  description: 'fooey far hold',
  isPublic: true,
};

export const sampleWithFullData: IPlaylist = {
  id: 14165,
  playlistID: 18630,
  name: 'french shadowy',
  description: 'yippee',
  isPublic: true,
};

export const sampleWithNewData: NewPlaylist = {
  playlistID: 8851,
  name: 'beyond pulp',
  isPublic: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
