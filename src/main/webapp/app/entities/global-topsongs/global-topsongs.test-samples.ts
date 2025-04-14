import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 32330,
  playCount: 22061,
  monthYear: dayjs('2025-02-28T01:02'),
  year: 2089,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 12775,
  playCount: 14825,
  monthYear: dayjs('2025-02-28T06:51'),
  year: 2056,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 26909,
  playCount: 6103,
  monthYear: dayjs('2025-02-27T18:44'),
  year: 2069,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  playCount: 15892,
  monthYear: dayjs('2025-02-28T06:09'),
  year: 2051,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
