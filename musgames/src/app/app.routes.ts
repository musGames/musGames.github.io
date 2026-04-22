import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ForgotPassword } from './forgot-password/forgot-password';

export const routes: Routes = [
{
    path:'',
    redirectTo: 'login',
    pathMatch: 'full' 
},


      { path: 'login', component: Login },
      { path: 'forgot-password', component: ForgotPassword },

];
