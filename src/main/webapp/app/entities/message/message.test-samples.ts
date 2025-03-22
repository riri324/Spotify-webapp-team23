import dayjs from 'dayjs/esm';

import { IMessage, NewMessage } from './message.model';

export const sampleWithRequiredData: IMessage = {
  id: 12279,
  subject: 'incidentally biodegr',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
};

export const sampleWithPartialData: IMessage = {
  id: 13945,
  subject: 'apud sleet quantify',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
};

export const sampleWithFullData: IMessage = {
  id: 13636,
  subject: 'whenever until eek',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-11'),
  seen: true,
};

export const sampleWithNewData: NewMessage = {
  subject: 'gosh',
  content: '../fake-data/blob/hipster.txt',
  sent: dayjs('2025-03-12'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
