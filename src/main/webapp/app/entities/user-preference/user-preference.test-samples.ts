import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 21627,
};

export const sampleWithPartialData: IUserPreference = {
  id: 1395,
  favoriteGenre: 'whose',
  musicPurpose: 'nor rationalise frightfully',
  listeningTime: 'lest however',
  songLength: 'blah dislocate stake',
};

export const sampleWithFullData: IUserPreference = {
  id: 21057,
  favoriteGenre: 'pity',
  musicPurpose: 'yahoo joyously gosh',
  musicMood: 'acceptable airman excitable',
  vocalPreference: 'without',
  listeningTime: 'where ample',
  listeningPattern: 'oh',
  songLength: 'drat flat',
  lyricsImportance: 'barring perfectly but',
};

export const sampleWithNewData: NewUserPreference = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
