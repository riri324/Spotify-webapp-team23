import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LikedSongsResolve from './route/liked-songs-routing-resolve.service';

const likedSongsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/liked-songs.component').then(m => m.LikedSongsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/liked-songs-detail.component').then(m => m.LikedSongsDetailComponent),
    resolve: {
      likedSongs: LikedSongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/liked-songs-update.component').then(m => m.LikedSongsUpdateComponent),
    resolve: {
      likedSongs: LikedSongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/liked-songs-update.component').then(m => m.LikedSongsUpdateComponent),
    resolve: {
      likedSongs: LikedSongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default likedSongsRoute;
