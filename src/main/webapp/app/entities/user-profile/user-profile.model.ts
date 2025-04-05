import { IUser } from 'app/entities/user/user.model';

export interface IUserProfile {
  id: number;
  studentId?: string | null;
  name?: string | null;
  age?: number | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
