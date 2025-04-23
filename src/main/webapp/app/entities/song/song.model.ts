import { IAlbum } from 'app/entities/album/album.model';
import { IGenre } from 'app/entities/genre/genre.model';
import { IArtist } from 'app/entities/artist/artist.model';
import { IPlaylist } from 'app/entities/playlist/playlist.model';
import { IListeningHistory } from 'app/entities/listening-history/listening-history.model';

export interface ISong {
  id: number;
  songId?: string | null;
  trackName?: string | null;
  danceability?: number | null;
  energy?: number | null;
  speechiness?: number | null;
  acousticness?: number | null;
  instrumentalness?: number | null;
  liveness?: number | null;
  valence?: number | null;
  tempo?: number | null;
  album?: IAlbum | null;
  genre?: IGenre | null;
  artist?: IArtist | null;
  playlists?: IPlaylist[] | null;
  listeningHistories?: IListeningHistory[] | null;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
