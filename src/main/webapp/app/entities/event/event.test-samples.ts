import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 29795,
  datetime: dayjs('2025-02-05T18:47'),
};

export const sampleWithPartialData: IEvent = {
  id: 20538,
  datetime: dayjs('2025-02-05T12:19'),
  title: 'plump key at',
  country: 'New Zealand',
};

export const sampleWithFullData: IEvent = {
  id: 5346,
  datetime: dayjs('2025-02-05T04:58'),
  description: 'bright',
  title: 'mobilize',
  artistName: 'incandescence',
  venueName: 'freely',
  city: 'Simonisland',
  region: 'given',
  country: 'Sao Tome and Principe',
};

export const sampleWithNewData: NewEvent = {
  datetime: dayjs('2025-02-04T20:31'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
