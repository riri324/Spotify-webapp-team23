import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 8144,
  subject: 'jovially vivaciously',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
};

export const sampleWithPartialData: IMessage = {
  id: 487,
  subject: 'nor spotless',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
};

export const sampleWithFullData: IMessage = {
  id: 15020,
  subject: 'modulo absent valian',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
  seen: false,
};

export const sampleWithNewData: NewMessage = {
  subject: 'acceptable than fore',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
