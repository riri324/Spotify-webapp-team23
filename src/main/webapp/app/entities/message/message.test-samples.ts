import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 6933,
  subject: 'duh correctly excepting',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
};

export const sampleWithPartialData: IMessage = {
  id: 500,
  subject: 'plus turret',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
};

export const sampleWithFullData: IMessage = {
  id: 30849,
  subject: 'mathematics',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
  seen: true,
};

export const sampleWithNewData: NewMessage = {
  subject: 'recompense towards emphasize',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
