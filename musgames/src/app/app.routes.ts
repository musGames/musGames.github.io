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
import { GameInterfaceComponent } from './game-interface/game-interface';
import { SettingsComponent } from './settings/settings';
import { uploadgameComponent } from './upload-game/upload-game';
import { ImageUploaderComponent } from './image-uploader/image-uploader';
import { NavbarComponent } from './navbar/navbar';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
    {path: 'login', component: Login },
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'signup', component: Signup},
    {path: 'forgot-password', component: ForgotPassword},
    {path: 'admin-dashboard', component: AdminDashboard, canActivate: [AdminGuard]},
    {path: 'leaderboard', component: Leaderboard, canActivate: [AuthGuard]},
    {path: 'game/:gameId', component: GameInterfaceComponent, canActivate: [AuthGuard]},
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    {path: 'upload-game', component: uploadgameComponent, canActivate: [AdminGuard]},
    {path: 'upload-image', component: ImageUploaderComponent, canActivate: [AdminGuard]},
    {path: 'navbar', component: NavbarComponent, canActivate: [AuthGuard]},  

];
