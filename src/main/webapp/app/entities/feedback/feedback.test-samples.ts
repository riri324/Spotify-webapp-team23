import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 28806,
};

export const sampleWithPartialData: IFeedback = {
  id: 22352,
  username: 'buzzing although',
  rating: 20360,
};

export const sampleWithFullData: IFeedback = {
  id: 27144,
  feedbackId: 9449,
  username: 'gripper eek',
  userEmail: 'indeed knit ew',
  userPhineNum: 2407,
  message: 'preheat',
  rating: 13792,
};

export const sampleWithNewData: NewFeedback = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
