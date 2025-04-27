import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ConcertResolve from './route/concert-routing-resolve.service';

const concertRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/concert.component').then(m => m.ConcertComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/concert-detail.component').then(m => m.ConcertDetailComponent),
    resolve: {
      concert: ConcertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/concert-update.component').then(m => m.ConcertUpdateComponent),
    resolve: {
      concert: ConcertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/concert-update.component').then(m => m.ConcertUpdateComponent),
    resolve: {
      concert: ConcertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default concertRoute;
