import dayjs from 'dayjs/esm';

import { IListeningHistory, NewListeningHistory } from './listening-history.model';

export const sampleWithRequiredData: IListeningHistory = {
  id: 28856,
  historyID: 11937,
  timestamp: dayjs('2025-04-03T16:11'),
};

export const sampleWithPartialData: IListeningHistory = {
  id: 22000,
  historyID: 2511,
  timestamp: dayjs('2025-04-03T12:54'),
};

export const sampleWithFullData: IListeningHistory = {
  id: 922,
  historyID: 12352,
  timestamp: dayjs('2025-04-03T02:27'),
};

export const sampleWithNewData: NewListeningHistory = {
  historyID: 30275,
  timestamp: dayjs('2025-04-03T08:01'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
