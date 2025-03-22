import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 17990,
};

export const sampleWithPartialData: IFeedback = {
  id: 22295,
  userEmail: 'whereas',
  userPhineNum: 31044,
  message: 'functional strident indeed',
};

export const sampleWithFullData: IFeedback = {
  id: 11856,
  feedbackId: 12287,
  username: 'idle because',
  userEmail: 'rotten',
  userPhineNum: 3753,
  message: 'whether excitedly',
  rating: 18019,
};

export const sampleWithNewData: NewFeedback = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
