import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 21902,
};

export const sampleWithPartialData: IUserPreference = {
  id: 16286,
  favoriteGenre: 'liquid ew continually',
  musicPurpose: 'agitated until sour',
  musicMood: 'disarm permafrost yawningly',
  listeningTime: 'likewise instead exactly',
  lyricsImportance: 'runny norm',
};

export const sampleWithFullData: IUserPreference = {
  id: 28132,
  favoriteGenre: 'cop-out gulp',
  musicPurpose: 'impolite continually chime',
  musicMood: 'among aboard',
  vocalPreference: 'really grown hollow',
  listeningTime: 'tightly knavishly',
  listeningPattern: 'bright',
  songLength: 'wherever',
  lyricsImportance: 'where demonstrate',
};

export const sampleWithNewData: NewUserPreference = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
