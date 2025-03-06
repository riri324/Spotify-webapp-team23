import { IPlaylist, NewPlaylist } from './playlist.model';

export const sampleWithRequiredData: IPlaylist = {
  id: 8731,
  name: 'hm phew willfully',
};

export const sampleWithPartialData: IPlaylist = {
  id: 19507,
  name: 'than cemetery',
  description: 'velocity above',
};

export const sampleWithFullData: IPlaylist = {
  id: 2291,
  name: 'zowie truly ferociously',
  description: 'contradict beyond',
};

export const sampleWithNewData: NewPlaylist = {
  name: 'beyond indeed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
