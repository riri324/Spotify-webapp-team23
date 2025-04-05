import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: 21546,
  genreID: 15602,
  songGenre: 'agreeable next',
};

export const sampleWithPartialData: IGenre = {
  id: 19802,
  genreID: 24721,
  songGenre: 'libel why',
};

export const sampleWithFullData: IGenre = {
  id: 25144,
  genreID: 24000,
  songGenre: 'duh until uh-huh',
};

export const sampleWithNewData: NewGenre = {
  genreID: 4140,
  songGenre: 'yuck which upon',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
