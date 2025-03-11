import { ISong } from 'app/entities/song/song.model';

export interface IPlaylist {
  id: number;
  name?: string | null;
  description?: string | null;
  songs?: ISong[] | null;
}

export type NewPlaylist = Omit<IPlaylist, 'id'> & { id: null };
