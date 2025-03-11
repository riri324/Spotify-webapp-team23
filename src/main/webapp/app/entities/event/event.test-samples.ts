import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 6045,
  artistId: 4852,
};

export const sampleWithPartialData: IEvent = {
  id: 6972,
  artistId: 29015,
  datetime: dayjs('2025-02-05T12:51'),
  title: 'till smoothly provider',
  city: 'Carrollbury',
  region: 'crowded until',
  country: 'Sudan',
};

export const sampleWithFullData: IEvent = {
  id: 3027,
  artistId: 19183,
  datetime: dayjs('2025-02-05T00:03'),
  description: 'downshift supposing brace',
  title: 'intelligent lean',
  venueName: 'wedge carefully',
  city: 'East Corbin',
  region: 'close and',
  country: 'Jamaica',
};

export const sampleWithNewData: NewEvent = {
  artistId: 14842,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
