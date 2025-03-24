import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import RecommendResolve from './route/recommend-routing-resolve.service';

const recommendRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/recommend.component').then(m => m.RecommendComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/recommend-detail.component').then(m => m.RecommendDetailComponent),
    resolve: {
      recommend: RecommendResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/recommend-update.component').then(m => m.RecommendUpdateComponent),
    resolve: {
      recommend: RecommendResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/recommend-update.component').then(m => m.RecommendUpdateComponent),
    resolve: {
      recommend: RecommendResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default recommendRoute;
