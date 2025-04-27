import { IRecommend, NewRecommend } from './recommend.model';

export const sampleWithRequiredData: IRecommend = {
  id: 20041,
  userId: 'unless',
  recommendedUserId: 'aw',
  commonSongsCount: 27087,
};

export const sampleWithPartialData: IRecommend = {
  id: 32341,
  userId: 'ouch following',
  recommendedUserId: 'drat',
  commonSongsCount: 7819,
};

export const sampleWithFullData: IRecommend = {
  id: 13588,
  userId: 'sympathetically gloom',
  recommendedUserId: 'meanwhile before',
  commonSongsCount: 28062,
};

export const sampleWithNewData: NewRecommend = {
  userId: 'achieve now',
  recommendedUserId: 'eek inferior',
  commonSongsCount: 24053,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
