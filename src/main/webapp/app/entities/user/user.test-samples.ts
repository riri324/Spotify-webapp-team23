import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 22216,
  login: 'amused incidentally',
};

export const sampleWithPartialData: IUser = {
  id: 17368,
  login: 'gratefully converse angle',
};

export const sampleWithFullData: IUser = {
  id: 27050,
  login: 'major zowie',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
