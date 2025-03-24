import { IUser } from 'app/entities/user/user.model';
import { ISong } from 'app/entities/song/song.model';

export interface IPlaylist {
  id: number;
  playlistID?: number | null;
  name?: string | null;
  description?: string | null;
  isPublic?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  songs?: ISong[] | null;
}

export type NewPlaylist = Omit<IPlaylist, 'id'> & { id: null };
