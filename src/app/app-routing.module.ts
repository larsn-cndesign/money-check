import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './core/components/login/login.component';
import { AuthGuard } from './shared/services/auth-guard.service';

export const routes: Routes = [
  { path: 'login', title: 'Logga In', component: LoginComponent },
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then((m) => m.FeatureModule),
    canMatch: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
