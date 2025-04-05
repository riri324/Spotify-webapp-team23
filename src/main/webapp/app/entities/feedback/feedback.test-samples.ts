import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 26252,
};

export const sampleWithPartialData: IFeedback = {
  id: 9667,
  message: 'per',
};

export const sampleWithFullData: IFeedback = {
  id: 7914,
  feedbackId: 28899,
  username: 'clone',
  userEmail: 'absent pastel',
  userPhineNum: 14457,
  message: 'why reasoning',
  rating: 30532,
};

export const sampleWithNewData: NewFeedback = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
