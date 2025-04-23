import { Routes } from '@angular/router';
import { UserPreferenceComponent } from './preferences.component';

const preferencesRoutes: Routes = [
  {
    path: '',
    component: UserPreferenceComponent,
    data: {
      pageTitle: 'Preferences',
    },
  },
];

export default preferencesRoutes;
