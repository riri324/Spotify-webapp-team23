import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 1554,
  login: 'round',
};

export const sampleWithPartialData: IUser = {
  id: 514,
  login: 'birdbath productive after',
};

export const sampleWithFullData: IUser = {
  id: 25534,
  login: 'vacantly form border',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
