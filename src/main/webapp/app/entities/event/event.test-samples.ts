import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 25909,
  artistId: 27158,
};

export const sampleWithPartialData: IEvent = {
  id: 24213,
  artistId: 3400,
  datetime: dayjs('2025-02-05T04:25'),
  description: 'fairly including after',
  title: 'behind scenario',
  venueName: 'dim absent lava',
  city: 'Boyleborough',
};

export const sampleWithFullData: IEvent = {
  id: 30418,
  artistId: 3750,
  datetime: dayjs('2025-02-05T08:25'),
  description: 'ripe',
  title: 'aha',
  venueName: 'frankly',
  city: 'Bismarck',
  region: 'tired',
  country: 'Guam',
};

export const sampleWithNewData: NewEvent = {
  artistId: 5291,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
