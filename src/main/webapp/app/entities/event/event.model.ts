import dayjs from 'dayjs/esm';

export interface IEvent {
  id: number;
  datetime?: dayjs.Dayjs | null;
  description?: string | null;
  title?: string | null;
  artistName?: string | null;
  venueName?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
