import dayjs from 'dayjs/esm';

export interface IMessage {
  id: number;
  subject?: string | null;
  content?: string | null;
  sent?: dayjs.Dayjs | null;
  seen?: boolean | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
