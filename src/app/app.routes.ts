import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: 'auth/Login',
    component: LoginComponent,
    title: 'User Login',
  },
  {
    path: 'auth/Register',
    component: RegisterComponent,
    title: 'User Register',
  },
];
