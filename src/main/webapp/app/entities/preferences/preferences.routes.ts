import { Routes } from '@angular/router';
import { PreferencesComponent } from './preferences.component';

const preferencesRoutes: Routes = [
  {
    path: '',
    component: PreferencesComponent,
    data: {
      pageTitle: 'Preferences',
    },
  },
];

export default preferencesRoutes;
