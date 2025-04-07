import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 25795,
  studentId: 'hm saturate so',
  name: 'who accessorise numb',
  age: 18177,
};

export const sampleWithPartialData: IUserProfile = {
  id: 4922,
  studentId: 'valuable likewise front',
  name: 'selfishly tough',
  age: 20263,
};

export const sampleWithFullData: IUserProfile = {
  id: 19399,
  studentId: 'tight drat bus',
  name: 'although hence while',
  age: 14922,
  profileImageUrl: 'annually',
  bio: 'inasmuch sweatshop although',
};

export const sampleWithNewData: NewUserProfile = {
  studentId: 'where',
  name: 'modulo ew considering',
  age: 27472,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
