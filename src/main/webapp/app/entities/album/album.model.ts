import { IArtist } from 'app/entities/artist/artist.model';

export interface IAlbum {
  id: number;
  albumID?: number | null;
  albumName?: string | null;
  numberOfSongs?: number | null;
  image?: string | null;
  imageContentType?: string | null;
  artist?: IArtist | null;
}

export type NewAlbum = Omit<IAlbum, 'id'> & { id: null };
