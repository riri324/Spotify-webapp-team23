import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';
import { UserPreferenceComponent } from './entities/preferences/preferences.component';
import { StudentProfileComponent } from './entities/student-profile/student-profile.component';

const routes: Routes = [
  {
    path: 'gdpr-policy',
    loadComponent: () => import('./gdpr-policy/gdpr-policy.component'),
    title: 'GDPR Policy',
  },
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
    title: 'Team project 2024-2025 app',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/navbar/navbar.component'),
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: 'recommend',
    loadComponent: () => import('./recommend/recommend.component').then(m => m.RecommendComponent),
    title: 'recommend.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  {
    path: 'recommender',
    loadComponent: () => import('./recommender/recommender.component').then(m => m.RecommenderComponent),
  },
  {
    path: 'venue-recommendations',
    loadComponent: () => import('./venue-recc/venue-recc.component').then(m => m.VenueReccComponent),
    title: 'Venue Recommendations',
  },
  {
    path: 'messages',
    loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent),
    title: 'Messages',
  },
  {
    path: 'global-top-songs',
    data: { pageTitle: 'Global Top Songs' },
    loadChildren: () => import('./top-song/top-song.routes').then(m => m.default),
  },
  {
    path: 'preferences', // ✅ 설문 전용 페이지
    component: UserPreferenceComponent,
    data: { pageTitle: 'Preferences Form' },
    canActivate: [UserRouteAccessService], // 로그인 유지 (원하면 제거 가능)
  },
  {
    path: 'profile', // ✅ 설문 전용 페이지
    component: StudentProfileComponent,
    data: { pageTitle: 'user profile' },
    canActivate: [UserRouteAccessService], // 로그인 유지 (원하면 제거 가능)
  },
  {
    path: 'user-preference', // ✅ JHipster 엔티티 전체 경로 (리스트/상세/수정/삭제)
    loadChildren: () => import('./entities/user-preference/user-preference.routes').then(m => m.default),
  },
  {
    path: 'user-profile', // ✅ JHipster 엔티티 전체 경로 (리스트/상세/수정/삭제)
    loadChildren: () => import('./entities/user-profile/user-profile.routes').then(m => m.default),
  },
  ...errorRoute,
];

export default routes;
