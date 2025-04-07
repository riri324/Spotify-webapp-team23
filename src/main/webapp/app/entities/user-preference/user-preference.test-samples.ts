import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 28846,
};

export const sampleWithPartialData: IUserPreference = {
  id: 16195,
  musicPurpose: 'monthly',
  listeningTime: 'grade that',
  listeningPattern: 'gosh',
  lyricsImportance: 'vastly',
};

export const sampleWithFullData: IUserPreference = {
  id: 26889,
  favoriteGenre: 'oh',
  musicPurpose: 'forgather huzzah',
  musicMood: 'duh indeed than',
  vocalPreference: 'geez petal what',
  listeningTime: 'heavily sand',
  listeningPattern: 'clamor',
  songLength: 'mobility oh',
  lyricsImportance: 'um gift',
};

export const sampleWithNewData: NewUserPreference = {
  favoriteGenre: 'from',
  musicPurpose: 'for',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
