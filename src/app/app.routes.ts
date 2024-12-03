import { Routes } from '@angular/router';
import {MainMenuComponent} from "./components/main-menu/main-menu.component";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivateChild: [authGuard],
    canActivate: [authGuard],
    children: [
      {
        path: 'project/:projectId',
        loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'project/:projectId/user',
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent),
  }
];
