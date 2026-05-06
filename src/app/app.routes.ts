import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'surveys/new',
    loadComponent: () => import('./surveys/new-survey.component').then((m) => m.NewSurveyComponent)
  },
  {
    path: 'surveys/:id',
    loadComponent: () => import('./surveys/survey-detail.component').then((m) => m.SurveyDetailComponent)
  },
  { path: '**', redirectTo: '/auth/login' }
];
