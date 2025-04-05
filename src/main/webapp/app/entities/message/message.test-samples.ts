import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 7068,
  subject: 'regular burgeon libe',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
};

export const sampleWithPartialData: IMessage = {
  id: 25042,
  subject: 'giggle',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
  seen: false,
};

export const sampleWithFullData: IMessage = {
  id: 24203,
  subject: 'considering scarper ',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
  seen: false,
};

export const sampleWithNewData: NewMessage = {
  subject: 'gratefully yuck the',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
