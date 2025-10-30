// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login.page').then(m => m.LoginPage) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders.page').then(m => m.OrdersPage) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },   // 👈 primero login
  { path: '**', redirectTo: 'login' },
];