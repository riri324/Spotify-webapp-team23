import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export enum MessageStatus {
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface IMessage {
  id: number | null;
  subject?: string | null;
  content?: string | null;
  sent?: dayjs.Dayjs | null;
  seen?: boolean | null;
  status?: MessageStatus | null;

  /** Nested user objects */
  sender?: Pick<IUser, 'id' | 'login'> | null;
  recipient?: Pick<IUser, 'id' | 'login'> | null;
}

// For create(): same as IMessage but id must be null
export type NewMessage = Omit<IMessage, 'id'> & { id: null };
