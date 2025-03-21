import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: 13534,
  genreID: 15960,
  songGenre: 'through yieldingly',
};

export const sampleWithPartialData: IGenre = {
  id: 22407,
  genreID: 27559,
  songGenre: 'amidst sociable',
};

export const sampleWithFullData: IGenre = {
  id: 24201,
  genreID: 18272,
  songGenre: 'furthermore apropos order',
};

export const sampleWithNewData: NewGenre = {
  genreID: 24527,
  songGenre: 'hovercraft hunger dull',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
