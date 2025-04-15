import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 14965,
  favoriteGenre: 'via quarrelsomely',
  musicPurpose: 'victoriously',
};

export const sampleWithPartialData: IUserPreference = {
  id: 25652,
  favoriteGenre: 'deadly culminate tro',
  musicPurpose: 'delightfully never once',
  listeningTime: 'disposer cross usefully',
  lyricsImportance: 'unsung um utterly',
};

export const sampleWithFullData: IUserPreference = {
  id: 32036,
  favoriteGenre: 'whenever',
  musicPurpose: 'ick because brr',
  musicMood: 'service phooey nippy',
  vocalPreference: 'kindheartedly that hence',
  listeningTime: 'lashes trek',
  listeningPattern: 'unscramble',
  songLength: 'heighten',
  lyricsImportance: 'phew',
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
