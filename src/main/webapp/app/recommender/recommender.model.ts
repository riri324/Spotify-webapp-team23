export class Playlist {
  constructor(
    public id: number,
    public name: string,
    public description?: string
  ) {}
}

export class Song {
  constructor(
    public trackId: string,
    public trackName?: string,
    public artists?: string,
    public albumName?: string,
    public danceability?: number,
    public energy?: number,
    public speechiness?: number,
    public acousticness?: number,
    public instrumentalness?: number,
    public liveness?: number,
    public valence?: number,
    public tempo?: number,
    public trackGenre?: string
  ) {}
}
