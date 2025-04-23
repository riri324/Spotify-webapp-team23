import dayjs from 'dayjs/esm';

import { IGlobalTopsongs, NewGlobalTopsongs } from './global-topsongs.model';

export const sampleWithRequiredData: IGlobalTopsongs = {
  id: 5655,
  songTitle: 'scarcely wry ew',
  artistName: 'intervention poorly hovercraft',
  playCount: 18753,
  monthYear: dayjs('2025-02-27T18:52'),
  songYear: 2053,
};

export const sampleWithPartialData: IGlobalTopsongs = {
  id: 27736,
  songTitle: 'appropriate oh',
  artistName: 'geez',
  playCount: 8223,
  monthYear: dayjs('2025-02-27T18:05'),
  songYear: 2028,
};

export const sampleWithFullData: IGlobalTopsongs = {
  id: 32493,
  songTitle: 'legging',
  artistName: 'ah override',
  playCount: 1143,
  monthYear: dayjs('2025-02-28T03:08'),
  songYear: 2091,
};

export const sampleWithNewData: NewGlobalTopsongs = {
  songTitle: 'pilot scale portray',
  artistName: 'swanling',
  playCount: 13822,
  monthYear: dayjs('2025-02-28T05:18'),
  songYear: 2010,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
