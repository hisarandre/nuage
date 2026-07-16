import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth').then(m => m.Auth)
  },
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  { path: '**', redirectTo: 'login' }
];
