import { IUser } from 'app/entities/user/user.model';

export interface IUserPreference {
  id: number;
  favoriteGenre?: string | null;
  musicPurpose?: string | null;
  musicMood?: string | null;
  vocalPreference?: string | null;
  listeningTime?: string | null;
  listeningPattern?: string | null;
  songLength?: string | null;
  lyricsImportance?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserPreference = Omit<IUserPreference, 'id'> & { id: null };
