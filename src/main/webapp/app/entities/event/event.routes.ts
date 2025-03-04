import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import EventResolve from './route/event-routing-resolve.service';

const eventRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/event.component').then(m => m.EventComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/event-detail.component').then(m => m.EventDetailComponent),
    resolve: {
      event: EventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/event-update.component').then(m => m.EventUpdateComponent),
    resolve: {
      event: EventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/event-update.component').then(m => m.EventUpdateComponent),
    resolve: {
      event: EventResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default eventRoute;
