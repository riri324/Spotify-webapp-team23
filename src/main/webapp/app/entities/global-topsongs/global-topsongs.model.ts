import dayjs from 'dayjs/esm';

export interface IGlobalTopsongs {
  id: number;
  songTitle?: string | null;
  artistName?: string | null;
  playCount?: number | null;
  monthYear?: dayjs.Dayjs | null;
  year?: number | null;
}

export type NewGlobalTopsongs = Omit<IGlobalTopsongs, 'id'> & { id: null };
