import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';
import { TopSongsComponent } from '../app/top-song/top-song.component';

const routes: Routes = [
  {
    path: 'gdpr-policy',
    loadComponent: () => import('./gdpr-policy/gdpr-policy.component'),
    title: 'GDPR Policy',
  },
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'Team project 2024-2025 app',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: 'recommend',
    loadComponent: () => import('./recommend/recommend.component').then(m => m.RecommendComponent),
    title: 'recommend.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  {
    path: 'recommender',
    loadComponent: () => import('./recommender/recommender.component').then(m => m.RecommenderComponent),
  },
  {
    path: 'venue-recommendations',
    loadComponent: () => import('./venue-recc/venue-recc.component').then(m => m.VenueReccComponent),
    title: 'Venue Recommendations',
  },
  {
    path: 'feedback',
    loadComponent: () => import('./feedback/feedback.component').then(m => m.FeedbackComponent),
    title: 'Feedback',
  },
  {
    path: 'messages',
    loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent),
    title: 'Messages',
  },
  {
    path: 'global-top-songs',
    loadChildren: () => import('./entities/global-topsongs/global-topsongs.routes').then(m => m.default),
  },
  {
    path: 'preferences',
    data: { pageTitle: 'Preferences' },
    loadChildren: () => import('./entities/preferences/preferences.routes').then(m => m.default),
  },
  {
    path: 'topsongs',
    component: TopSongsComponent,
    data: { pageTitle: 'globaltopsong' },
  },

  ...errorRoute,
];

export default routes;
