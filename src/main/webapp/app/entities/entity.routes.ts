import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { UserPreferenceComponent } from './preferences/preferences.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'playlist',
    data: { pageTitle: 'Playlists' },
    loadChildren: () => import('./playlist/playlist.routes'),
  },
  {
    path: 'song',
    data: { pageTitle: 'Songs' },
    loadChildren: () => import('./song/song.routes'),
  },
  {
    path: 'artist',
    data: { pageTitle: 'Artists' },
    loadChildren: () => import('./artist/artist.routes'),
  },
  {
    path: 'album',
    data: { pageTitle: 'Albums' },
    loadChildren: () => import('./album/album.routes'),
  },
  {
    path: 'genre',
    data: { pageTitle: 'Genres' },
    loadChildren: () => import('./genre/genre.routes'),
  },
  {
    path: 'event',
    data: { pageTitle: 'Events' },
    loadChildren: () => import('./event/event.routes'),
  },
  {
    path: 'user-preference',
    data: { pageTitle: 'UserPreferences' },
    loadChildren: () => import('./user-preference/user-preference.routes'),
  },
  {
    path: 'global-topsongs',
    data: { pageTitle: 'GlobalTopsongs' },
    loadChildren: () => import('./global-topsongs/global-topsongs.routes'),
  },
  {
    path: 'feedback',
    data: { pageTitle: 'Feedbacks' },
    loadChildren: () => import('./feedback/feedback.routes'),
  },
  {
    path: 'message',
    data: { pageTitle: 'Messages' },
    loadChildren: () => import('./message/message.routes'),
  },
  {
    path: 'listening-history',
    data: { pageTitle: 'ListeningHistories' },
    loadChildren: () => import('./listening-history/listening-history.routes'),
  },
  {
    path: 'liked-songs',
    data: { pageTitle: 'LikedSongs' },
    loadChildren: () => import('./liked-songs/liked-songs.routes'),
  },
  {
    path: 'user-profile',
    data: { pageTitle: 'UserProfiles' },
    loadChildren: () => import('./user-profile/user-profile.routes'),
  },
  {
    path: 'preferences',
    component: UserPreferenceComponent,
    data: { pageTitle: 'Preferences Form' },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'profile',
    component: StudentProfileComponent,
    data: { pageTitle: 'Profile' },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'concert',
    data: { pageTitle: 'Concerts' },
    loadChildren: () => import('./concert/concert.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
