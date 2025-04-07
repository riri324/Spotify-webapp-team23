import { ISong } from 'app/entities/song/song.model';

export interface ILikedSongs {
  id: number;
  likeID?: number | null;
  song?: ISong | null;
}

export type NewLikedSongs = Omit<ILikedSongs, 'id'> & { id: null };
