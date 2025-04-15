import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 26911,
  eventID: 26629,
  datetime: dayjs('2025-02-05T03:00'),
  title: 'until',
  venueName: 'though under independence',
  city: 'Myrticeburgh',
  region: 'against',
  country: 'Cayman Islands',
};

export const sampleWithPartialData: IEvent = {
  id: 9260,
  eventID: 32532,
  datetime: dayjs('2025-02-05T05:10'),
  description: 'degrease underneath yearningly',
  title: 'heartfelt dock culture',
  venueName: 'fair',
  city: 'New Anabelle',
  region: 'ew ha psst',
  country: 'Mexico',
};

export const sampleWithFullData: IEvent = {
  id: 12858,
  eventID: 11828,
  datetime: dayjs('2025-02-05T01:18'),
  description: 'wordy mixture how',
  title: 'exonerate',
  venueName: 'what why absent',
  city: 'Bartolettihaven',
  region: 'meanwhile pace',
  country: "Lao People's Democratic Republic",
};

export const sampleWithNewData: NewEvent = {
  eventID: 13374,
  datetime: dayjs('2025-02-05T16:42'),
  title: 'barring before up',
  venueName: 'unearth',
  city: 'New York',
  region: 'through splosh',
  country: 'Syrian Arab Republic',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
