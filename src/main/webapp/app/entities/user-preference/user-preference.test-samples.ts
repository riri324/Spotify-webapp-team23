import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 9362,
};

export const sampleWithPartialData: IUserPreference = {
  id: 22281,
  favoriteGenre: 'outside chapel',
  vocalPreference: 'mutate',
  listeningPattern: 'till',
};

export const sampleWithFullData: IUserPreference = {
  id: 9772,
  favoriteGenre: 'amid',
  musicPurpose: 'er indeed scholarship',
  musicMood: 'amid sleepily sham',
  vocalPreference: 'neaten',
  listeningTime: 'boohoo',
  listeningPattern: 'regarding uncover',
  songLength: 'goodwill contrast boohoo',
  lyricsImportance: 'truthfully',
};

export const sampleWithNewData: NewUserPreference = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
