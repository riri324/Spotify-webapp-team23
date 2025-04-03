export interface IFeedback {
  id: number;
  feedbackID?: number | null;
  userName?: string | null;
  userEmail?: string | null;
  userPhoneNum?: string | null;
  message?: string | null;
  rating?: number | null;
}

export type NewFeedback = Omit<IFeedback, 'id'> & { id: null };
