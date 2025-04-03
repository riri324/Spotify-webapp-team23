import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 8411,
  playlistID: 16809,
  name: 'hopelessly rim pace',
  isPublic: false,
};

export const sampleWithPartialData: IPlaylist = {
  id: 22527,
  playlistID: 12351,
  name: 'zowie',
  description: 'amount',
  isPublic: true,
};

export const sampleWithFullData: IPlaylist = {
  id: 5716,
  playlistID: 1133,
  name: 'weakly absentmindedly retrospectivity',
  description: 'apropos hm',
  isPublic: true,
};

export const sampleWithNewData: NewPlaylist = {
  playlistID: 27083,
  name: 'per smug dark',
  isPublic: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
