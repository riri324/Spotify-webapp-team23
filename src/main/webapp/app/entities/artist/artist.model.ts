export interface IArtist {
  id: number;
  artistName?: string | null;
  followers?: number | null;
  image?: string | null;
  imageContentType?: string | null;
}

export type NewArtist = Omit<IArtist, 'id'> & { id: null };
