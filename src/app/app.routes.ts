import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'surveys/new',
    canActivate: [authGuard],
    loadComponent: () => import('./surveys/new-survey.component').then((m) => m.NewSurveyComponent)
  },
  {
    path: 'surveys/wip',
    canActivate: [authGuard],
    loadComponent: () => import('./surveys/survey-wip.component').then((m) => m.SurveyWipComponent)
  },
  {
    path: 'surveys/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./surveys/survey-detail.component').then((m) => m.SurveyDetailComponent)
  },
  { path: '**', redirectTo: '/auth/login' }
];
