import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login.page').then(m => m.LoginPage) },

  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders.page').then(m => m.OrdersPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'pricing',
        canActivate: [permissionGuard],
        data: { required: { resource: 'framecontroller-backend', roles: ['Pricing'] } },
        loadComponent: () => import('./pages/pricing.page').then(m => m.PricingPage)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

