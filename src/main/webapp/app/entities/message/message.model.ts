import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IMessage {
  id: number;
  subject?: string | null;
  content?: string | null;
  sent?: dayjs.Dayjs | null;
  seen?: boolean | null;
  sender?: Pick<IUser, 'id'> | null;
  recipient?: Pick<IUser, 'id'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
