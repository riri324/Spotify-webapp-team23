import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 4952,
  subject: 'shrill incidentally ',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-03'),
};

export const sampleWithPartialData: IMessage = {
  id: 24783,
  subject: 'satirise',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-03'),
};

export const sampleWithFullData: IMessage = {
  id: 23445,
  subject: 'very',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-03'),
  seen: true,
};

export const sampleWithNewData: NewMessage = {
  subject: 'unsightly zowie',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-03'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
