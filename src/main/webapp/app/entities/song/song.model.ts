import { IPlaylist } from 'app/entities/playlist/playlist.model';

export interface ISong {
  id: number;
  trackId?: string | null;
  artists?: string | null;
  albumName?: string | null;
  trackName?: string | null;
  danceability?: number | null;
  energy?: number | null;
  speechiness?: number | null;
  acousticness?: number | null;
  instrumentalness?: number | null;
  liveness?: number | null;
  valence?: number | null;
  tempo?: number | null;
  trackGenre?: string | null;
  playlists?: IPlaylist[] | null;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
