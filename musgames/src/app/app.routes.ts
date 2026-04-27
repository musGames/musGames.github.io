import { Routes } from '@angular/router';
import { DashboardComponent } from '../app/dashboard/dashboard';
import { Login } from './login/login';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: Login},
  { path: 'dashboard', component: DashboardComponent}
];
