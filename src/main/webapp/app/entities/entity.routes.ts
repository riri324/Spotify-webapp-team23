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
    path: 'event',
    data: { pageTitle: 'Events' },
    loadChildren: () => import('./event/event.routes'),
  },
  {
    path: 'user-preference',
    data: { pageTitle: 'UserPreferences' },
    loadChildren: () => import('./user-preference/user-preference.routes'),
  },
  {
    path: 'global-topsongs',
    data: { pageTitle: 'GlobalTopsongs' },
    loadChildren: () => import('./global-topsongs/global-topsongs.routes'),
  },
  {
    path: 'feedback',
    data: { pageTitle: 'Feedbacks' },
    loadChildren: () => import('./feedback/feedback.routes'),
  },
  {
    path: 'message',
    data: { pageTitle: 'Messages' },
    loadChildren: () => import('./message/message.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
