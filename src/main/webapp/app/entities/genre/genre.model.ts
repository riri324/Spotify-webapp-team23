export interface IGenre {
  id: number;
  genreID?: number | null;
  songGenre?: string | null;
}

export type NewGenre = Omit<IGenre, 'id'> & { id: null };
