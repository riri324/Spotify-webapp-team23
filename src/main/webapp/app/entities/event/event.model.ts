import dayjs from 'dayjs/esm';
import { IArtist } from 'app/entities/artist/artist.model';

export interface IEvent {
  id: number;
  eventID?: number | null;
  datetime?: dayjs.Dayjs | null;
  description?: string | null;
  title?: string | null;
  venueName?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  artist?: IArtist | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
