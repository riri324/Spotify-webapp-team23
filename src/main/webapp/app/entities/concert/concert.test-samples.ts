import dayjs from 'dayjs/esm';

import { IConcert, NewConcert } from './concert.model';

export const sampleWithRequiredData: IConcert = {
  id: 17708,
  artistName: 'how pfft',
  venueName: 'declaration through',
  country: 'Holy See (Vatican City State)',
  eventDate: dayjs('2025-03-26T12:00'),
};

export const sampleWithPartialData: IConcert = {
  id: 17903,
  artistName: 'muted',
  venueName: 'delightfully',
  country: 'Bulgaria',
  region: 'given',
  eventDate: dayjs('2025-03-26T12:40'),
  externalUrl: 'overreact too',
};

export const sampleWithFullData: IConcert = {
  id: 10521,
  artistName: 'imaginative blowgun nifty',
  venueName: 'um uh-huh',
  country: 'Andorra',
  region: 'than boohoo once',
  eventDate: dayjs('2025-03-26T13:41'),
  ticketmasterEventId: 'overdue',
  imageUrl: 'solemnly',
  externalUrl: 'um likewise',
};

export const sampleWithNewData: NewConcert = {
  artistName: 'as ugh',
  venueName: 'pilot openly the',
  country: 'Cocos (Keeling) Islands',
  eventDate: dayjs('2025-03-25T21:28'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
