import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ArtistResolve from './route/artist-routing-resolve.service';

const artistRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/artist.component').then(m => m.ArtistComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/artist-detail.component').then(m => m.ArtistDetailComponent),
    resolve: {
      artist: ArtistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/artist-update.component').then(m => m.ArtistUpdateComponent),
    resolve: {
      artist: ArtistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/artist-update.component').then(m => m.ArtistUpdateComponent),
    resolve: {
      artist: ArtistResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default artistRoute;
