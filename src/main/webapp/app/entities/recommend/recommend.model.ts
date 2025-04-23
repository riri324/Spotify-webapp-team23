export interface IRecommend {
  id: number;
  userId?: string | null;
  recommendedUserId?: string | null;
  commonSongsCount?: number | null;
}

export type NewRecommend = Omit<IRecommend, 'id'> & { id: null };
