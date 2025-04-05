import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 29795,
  login: 'zowie plus warmly',
};

export const sampleWithPartialData: IUser = {
  id: 15062,
  login: 'zowie oof of',
};

export const sampleWithFullData: IUser = {
  id: 2376,
  login: 'representation aha',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
