import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IMessage {
  id: number | null;
  subject?: string | null;
  content?: string | null;
  sent?: dayjs.Dayjs | null;
  seen?: boolean | null;
  sender?: Pick<IUser, 'id' | 'login'> | null;
  recipient?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewMessage = Omit<IMessage, 'id'> & { id: null };
