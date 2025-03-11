import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SongResolve from './route/song-routing-resolve.service';

const songRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/song.component').then(m => m.SongComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/song-detail.component').then(m => m.SongDetailComponent),
    resolve: {
      song: SongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/song-update.component').then(m => m.SongUpdateComponent),
    resolve: {
      song: SongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/song-update.component').then(m => m.SongUpdateComponent),
    resolve: {
      song: SongResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default songRoute;
