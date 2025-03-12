import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 21963,
};

export const sampleWithPartialData: IFeedback = {
  id: 15744,
};

export const sampleWithFullData: IFeedback = {
  id: 14936,
  feedbackId: 13419,
  username: 'tomatillo majestically following',
  userEmail: 'mysterious openly',
  userPhineNum: 8021,
  message: 'once gadzooks char',
  rating: 28690,
};

export const sampleWithNewData: NewFeedback = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
