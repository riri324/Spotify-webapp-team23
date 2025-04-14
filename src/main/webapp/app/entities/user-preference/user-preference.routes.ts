import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UserPreferenceResolve from './route/user-preference-routing-resolve.service';

const userPreferenceRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/user-preference.component').then(m => m.UserPreferenceComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/user-preference-detail.component').then(m => m.UserPreferenceDetailComponent),
    resolve: {
      userPreference: UserPreferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/user-preference-update.component').then(m => m.UserPreferenceUpdateComponent),
    resolve: {
      userPreference: UserPreferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/user-preference-update.component').then(m => m.UserPreferenceUpdateComponent),
    resolve: {
      userPreference: UserPreferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userPreferenceRoute;
