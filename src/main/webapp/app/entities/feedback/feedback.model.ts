import { IUser } from 'app/entities/user/user.model';

export interface IFeedback {
  id: number;
  feedbackId?: number | null;
  username?: string | null;
  userEmail?: string | null;
  userPhineNum?: number | null;
  message?: string | null;
  rating?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewFeedback = Omit<IFeedback, 'id'> & { id: null };
