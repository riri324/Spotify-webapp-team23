import dayjs from 'dayjs/esm';
import { ISong } from 'app/entities/song/song.model';

export interface IGlobalTopsongs {
  id: number;
  playCount?: number | null;
  monthYear?: dayjs.Dayjs | null;
  year?: number | null;
  song?: ISong | null;
}

export type NewGlobalTopsongs = Omit<IGlobalTopsongs, 'id'> & { id: null };
