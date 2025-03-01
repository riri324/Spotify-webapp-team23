import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 4988,
  songTitle: 'along',
  artistName: 'geez reasoning among',
  playCount: 23381,
  monthYear: dayjs('2025-02-28T03:56'),
  year: 24227,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 29882,
  songTitle: 'since impact after',
  artistName: 'minus scoop',
  playCount: 11350,
  monthYear: dayjs('2025-02-28T00:47'),
  year: 24826,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 21889,
  songTitle: 'seafood',
  artistName: 'if',
  playCount: 1969,
  monthYear: dayjs('2025-02-28T09:24'),
  year: 13576,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  songTitle: 'reservation hoot political',
  artistName: 'within furthermore',
  playCount: 20479,
  monthYear: dayjs('2025-02-27T23:40'),
  year: 24574,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
