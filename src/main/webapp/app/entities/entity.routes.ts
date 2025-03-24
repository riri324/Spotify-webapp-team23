import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'playlist',
    data: { pageTitle: 'Playlists' },
    loadChildren: () => import('./playlist/playlist.routes'),
  },
  {
    path: 'song',
    data: { pageTitle: 'Songs' },
    loadChildren: () => import('./song/song.routes'),
  },
  {
    path: 'artist',
    data: { pageTitle: 'Artists' },
    loadChildren: () => import('./artist/artist.routes'),
  },
  {
    path: 'album',
    data: { pageTitle: 'Albums' },
    loadChildren: () => import('./album/album.routes'),
  },
  {
    path: 'genre',
    data: { pageTitle: 'Genres' },
    loadChildren: () => import('./genre/genre.routes'),
  },
  {
    path: 'recommend',
    data: { pageTitle: 'Recommends' },
    loadChildren: () => import('./recommend/recommend.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
