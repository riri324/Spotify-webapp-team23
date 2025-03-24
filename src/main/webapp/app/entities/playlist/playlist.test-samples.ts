import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 20754,
  name: 'attribute canter adrenalin',
};

export const sampleWithPartialData: IPlaylist = {
  id: 24485,
  name: 'moor since',
  description: 'vacation against',
};

export const sampleWithFullData: IPlaylist = {
  id: 8450,
  name: 'energetic',
  description: 'hospitable sniff irritably',
};

export const sampleWithNewData: NewPlaylist = {
  name: 'how before yieldingly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
