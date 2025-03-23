import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 782,
  playlistID: 5991,
  name: 'suckle helpful modulo',
  isPublic: false,
};

export const sampleWithPartialData: IPlaylist = {
  id: 10944,
  playlistID: 11954,
  name: 'fooey far hold',
  description: 'narrow',
  isPublic: true,
};

export const sampleWithFullData: IPlaylist = {
  id: 32586,
  playlistID: 9698,
  name: 'fluffy yippee',
  description: 'across',
  isPublic: false,
};

export const sampleWithNewData: NewPlaylist = {
  playlistID: 11047,
  name: 'classic',
  isPublic: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
