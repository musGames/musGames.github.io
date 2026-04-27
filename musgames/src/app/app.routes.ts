import { Routes } from '@angular/router';
import { DashboardComponent } from '../app/dashboard/dashboard';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Signup } from './signup/signup';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
    {path: 'login', component: Login },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'signup', component: Signup},
    {path: 'forgot-password', component: ForgotPassword}
];
