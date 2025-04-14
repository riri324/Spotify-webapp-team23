import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 11149,
  studentId: 'glum',
  name: 'warmly rebel pfft',
  age: 24874,
};

export const sampleWithPartialData: IUserProfile = {
  id: 6878,
  studentId: 'abnormally before',
  name: 'shaft',
  age: 1753,
  profileImageUrl: 'duster subexpression',
  bio: 'pivot',
};

export const sampleWithFullData: IUserProfile = {
  id: 867,
  studentId: 'exaggerate tricky',
  name: 'yowza bah carelessly',
  age: 27037,
  profileImageUrl: 'candid aw',
  bio: 'nor rim',
};

export const sampleWithNewData: NewUserProfile = {
  studentId: 'stupendous not',
  name: 'tremendously',
  age: 13581,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
