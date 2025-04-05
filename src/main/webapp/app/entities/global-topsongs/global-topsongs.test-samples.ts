import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 3907,
  songTitle: 'toward whoa',
  artistName: 'phew',
  playCount: 9163,
  monthYear: dayjs('2025-02-28T02:48'),
  year: 2033,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 4893,
  songTitle: 'yin aboard tuber',
  artistName: 'warmhearted however disbar',
  playCount: 5978,
  monthYear: dayjs('2025-02-28T12:48'),
  year: 2058,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 928,
  songTitle: 'disarm deficient serene',
  artistName: 'sans',
  playCount: 26139,
  monthYear: dayjs('2025-02-28T00:27'),
  year: 2000,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  songTitle: 'bah bowler ragged',
  artistName: 'unripe',
  playCount: 31371,
  monthYear: dayjs('2025-02-27T19:30'),
  year: 2048,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
