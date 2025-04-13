import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PlaylistResolve from './route/playlist-routing-resolve.service';

const playlistRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/playlist.component').then(m => m.PlaylistComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/playlist-detail.component').then(m => m.PlaylistDetailComponent),
    resolve: {
      playlist: PlaylistResolve,
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./update/playlist-update.component').then(m => m.PlaylistUpdateComponent),
    resolve: {
      playlist: PlaylistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/playlist-update.component').then(m => m.PlaylistUpdateComponent),
    resolve: {
      playlist: PlaylistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default playlistRoute;
