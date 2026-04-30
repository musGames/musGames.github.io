import { Routes } from '@angular/router';
import { DashboardComponent } from '../app/dashboard/dashboard';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Signup } from './signup/signup';
import path from 'path';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminGuard } from './guards/admin.guard';
import { Leaderboard } from './leaderboard/leaderboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
    {path: 'login', component: Login },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'signup', component: Signup},
    {path: 'forgot-password', component: ForgotPassword},
    {path: 'admin-dashboard', component: AdminDashboard, canActivate: [AdminGuard]},
    {path: 'leaderboard', component: Leaderboard}
];
