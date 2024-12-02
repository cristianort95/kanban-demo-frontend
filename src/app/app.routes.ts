import { Routes } from '@angular/router';
import {MainMenuComponent} from "./components/main-menu/main-menu.component";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent),
  }
];
