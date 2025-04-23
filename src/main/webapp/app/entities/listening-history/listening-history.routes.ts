import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ListeningHistoryResolve from './route/listening-history-routing-resolve.service';

const listeningHistoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/listening-history.component').then(m => m.ListeningHistoryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/listening-history-detail.component').then(m => m.ListeningHistoryDetailComponent),
    resolve: {
      listeningHistory: ListeningHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/listening-history-update.component').then(m => m.ListeningHistoryUpdateComponent),
    resolve: {
      listeningHistory: ListeningHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/listening-history-update.component').then(m => m.ListeningHistoryUpdateComponent),
    resolve: {
      listeningHistory: ListeningHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default listeningHistoryRoute;
