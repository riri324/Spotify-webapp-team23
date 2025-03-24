import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 13253,
  songTitle: 'that fledgling',
  artistName: 'obesity',
  playCount: 30374,
  monthYear: dayjs('2025-02-27T17:15'),
  year: 2024,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 11287,
  songTitle: 'boohoo redress',
  artistName: 'unibody',
  playCount: 3057,
  monthYear: dayjs('2025-02-27T18:12'),
  year: 2005,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 14571,
  songTitle: 'indeed',
  artistName: 'jacket',
  playCount: 29523,
  monthYear: dayjs('2025-02-27T22:05'),
  year: 2062,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  songTitle: 'sick firm ultimate',
  artistName: 'barracks truly unearth',
  playCount: 15622,
  monthYear: dayjs('2025-02-28T02:20'),
  year: 2054,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
