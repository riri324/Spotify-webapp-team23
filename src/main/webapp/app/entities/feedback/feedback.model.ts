import { IUser } from 'app/entities/user/user.model';

export interface IFeedback {
  id: number;
  feedbackID?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  userPhoneNum?: string | null;
  message?: string | null;
  rating?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewFeedback = Omit<IFeedback, 'id'> & { id: null };
