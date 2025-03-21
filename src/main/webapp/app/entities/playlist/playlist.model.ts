import { ISong } from 'app/entities/song/song.model';

export interface IPlaylist {
  id: number;
  playlistID?: number | null;
  name?: string | null;
  description?: string | null;
  isPublic?: boolean | null;
  songs?: ISong[] | null;
}

export type NewPlaylist = Omit<IPlaylist, 'id'> & { id: null };
