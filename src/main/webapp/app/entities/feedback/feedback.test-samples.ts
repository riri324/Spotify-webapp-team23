import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 3068,
  feedbackID: 4452,
  userName: 'kookily aw boo',
  userEmail: 'gee meanwhile where',
  rating: 8,
};

export const sampleWithPartialData: IFeedback = {
  id: 17382,
  feedbackID: 11939,
  userName: 'pomelo duh lazy',
  userEmail: 'finally unfreeze enlightened',
  userPhoneNum: 'furthermore dirty rewardi',
  message: 'task aside yuck',
  rating: 1,
};

export const sampleWithFullData: IFeedback = {
  id: 2454,
  feedbackID: 9418,
  userName: 'concerning provided fooey',
  userEmail: 'for aw yearly',
  userPhoneNum: 'among gad',
  message: 'zowie',
  rating: 9,
};

export const sampleWithNewData: NewFeedback = {
  feedbackID: 24355,
  userName: 'before faithfully strait',
  userEmail: 'ack',
  rating: 3,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
