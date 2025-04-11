import dayjs from 'dayjs/esm';

export interface IConcert {
  id: number;
  artistName?: string | null;
  venueName?: string | null;
  country?: string | null;
  region?: string | null;
  eventDate?: dayjs.Dayjs | null;
  ticketmasterEventId?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
}

export type NewConcert = Omit<IConcert, 'id'> & { id: null };
