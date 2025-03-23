import { Routes } from '@angular/router';
import { TopSongsComponent } from '../../../app/top-song/top-song.component';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GlobalTopsongsResolve from './route/global-topsongs-routing-resolve.service';

const globalTopsongsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/global-topsongs.component').then(m => m.GlobalTopsongsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/global-topsongs-detail.component').then(m => m.GlobalTopsongsDetailComponent),
    resolve: {
      globalTopsongs: GlobalTopsongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/global-topsongs-update.component').then(m => m.GlobalTopsongsUpdateComponent),
    resolve: {
      globalTopsongs: GlobalTopsongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/global-topsongs-update.component').then(m => m.GlobalTopsongsUpdateComponent),
    resolve: {
      globalTopsongs: GlobalTopsongsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'topsongs',
    component: TopSongsComponent,
    data: { pageTitle: 'globaltopsong' },
  },
];

export default globalTopsongsRoute;
