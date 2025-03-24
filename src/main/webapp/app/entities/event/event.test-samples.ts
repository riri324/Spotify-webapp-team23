import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 3222,
  artistId: 26333,
};

export const sampleWithPartialData: IEvent = {
  id: 5190,
  artistId: 28866,
  datetime: dayjs('2025-02-04T19:27'),
  venueName: 'ouch redress schematise',
  city: 'South Donnastad',
  country: 'Somalia',
};

export const sampleWithFullData: IEvent = {
  id: 21332,
  artistId: 8572,
  datetime: dayjs('2025-02-05T07:03'),
  description: 'pace',
  title: 'stump dazzling',
  venueName: 'lasting dull huzzah',
  city: 'West Jannie',
  region: 'barring',
  country: 'Bermuda',
};

export const sampleWithNewData: NewEvent = {
  artistId: 30066,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
