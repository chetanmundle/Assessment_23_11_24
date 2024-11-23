import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { OrgComponent } from './pages/org/org/org.component';
import { HomeComponent } from './pages/org/home/home.component';
import { ProfileComponent } from './pages/org/profile/profile.component';
import { UsersComponent } from './pages/org/users/users.component';
import { authGuard } from './core/Guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'org/Home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'Login',
        component: LoginComponent,
        title: 'User Login',
      },
      {
        path: 'Register',
        component: RegisterComponent,
        title: 'User Register',
      },
    ],
  },
  {
    path: 'org',
    component: OrgComponent,
    children: [
      {
        path: 'Home',
        component: HomeComponent,
        title: 'Home Page',
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Provider'] }, // Both Admins and Providers can access
      },
      {
        path: 'Profile',
        component: ProfileComponent,
        title: 'Profile Page',
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Provider'] }, // Both Admins and Providers can access
      },
      {
        path: 'Users',
        component: UsersComponent,
        title: 'Users Page',
        canActivate: [authGuard],
        data: { roles: ['Admin'] }, // Only Admin can access
      },
    ],
  },
  {
    path: '**',
    component:PageNotFoundComponent,
    
  }
];
