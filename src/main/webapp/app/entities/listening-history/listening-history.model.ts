import dayjs from 'dayjs/esm';
import { ISong } from 'app/entities/song/song.model';

export interface IListeningHistory {
  id: number;
  historyID?: number | null;
  timestamp?: dayjs.Dayjs | null;
  songs?: ISong[] | null;
}

export type NewListeningHistory = Omit<IListeningHistory, 'id'> & { id: null };
