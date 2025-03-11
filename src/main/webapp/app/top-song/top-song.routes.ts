import { Routes } from '@angular/router';
import { TopSongsComponent } from './top-song.component';

const globalTopSongsRoutes: Routes = [
  {
    path: '',
    component: TopSongsComponent,
    data: {
      pageTitle: 'Global Top Songs & Artists',
    },
  },
];

export default globalTopSongsRoutes;
