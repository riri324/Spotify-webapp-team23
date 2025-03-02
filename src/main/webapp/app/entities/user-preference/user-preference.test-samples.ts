import { IUserPreference, NewUserPreference } from './user-preference.model';

export const sampleWithRequiredData: IUserPreference = {
  id: 13911,
};

export const sampleWithPartialData: IUserPreference = {
  id: 26741,
  favoriteGenre: 'hmph pish',
  musicPurpose: 'outrun vice',
  vocalPreference: 'access yum pigsty',
  songLength: 'underneath forgo',
  lyricsImportance: 'below',
};

export const sampleWithFullData: IUserPreference = {
  id: 23143,
  favoriteGenre: 'stool',
  musicPurpose: 'editor',
  musicMood: 'coaxingly hmph',
  vocalPreference: 'reproachfully regarding',
  listeningTime: 'outfox',
  listeningPattern: 'jive exaggerate',
  songLength: 'wherever',
  lyricsImportance: 'relaunch solidly what',
};

export const sampleWithNewData: NewUserPreference = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
