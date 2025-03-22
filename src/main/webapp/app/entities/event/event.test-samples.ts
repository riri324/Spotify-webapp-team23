import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 22982,
  artistId: 30809,
};

export const sampleWithPartialData: IEvent = {
  id: 6085,
  artistId: 24504,
  description: 'supposing beneath elver',
};

export const sampleWithFullData: IEvent = {
  id: 8713,
  artistId: 21815,
  datetime: dayjs('2025-02-04T23:19'),
  description: 'these',
  title: 'enchanted',
  venueName: 'wisecrack rosin aw',
  city: 'New Lydaport',
  region: 'unsightly whether uselessly',
  country: 'Nauru',
};

export const sampleWithNewData: NewEvent = {
  artistId: 5277,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
