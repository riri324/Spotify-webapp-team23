import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: 2593,
  genreID: 25395,
  songGenre: 'humble than bolster',
};

export const sampleWithPartialData: IGenre = {
  id: 1374,
  genreID: 9799,
  songGenre: 'boastfully that',
};

export const sampleWithFullData: IGenre = {
  id: 4500,
  genreID: 25003,
  songGenre: 'dismal mad',
};

export const sampleWithNewData: NewGenre = {
  genreID: 22593,
  songGenre: 'however pant',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
