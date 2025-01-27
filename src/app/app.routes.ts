import { Route } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { canMatch } from './shared/services/auth-guard.service';

export const APP_ROUTES: Route[] = [
  { path: 'login', title: 'Logga In', component: LoginComponent },
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.routes').then((m) => m.FEATURE_ROUTES),
    canMatch: [canMatch],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent },
];
