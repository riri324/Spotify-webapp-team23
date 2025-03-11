import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 16212,
  songTitle: 'reasoning',
  artistName: 'ha briskly duh',
  playCount: 19143,
  monthYear: dayjs('2025-02-27T23:04'),
  year: 2013,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 13963,
  songTitle: 'once minus',
  artistName: 'incidentally',
  playCount: 12283,
  monthYear: dayjs('2025-02-28T09:58'),
  year: 2067,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 3465,
  songTitle: 'bog',
  artistName: 'bandwidth mummify',
  playCount: 19950,
  monthYear: dayjs('2025-02-27T20:21'),
  year: 2075,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  songTitle: 'towards grown',
  artistName: 'matter gee cheerfully',
  playCount: 25826,
  monthYear: dayjs('2025-02-27T21:47'),
  year: 2063,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
