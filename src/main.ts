// src/main.ts
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';

import { appRoutes } from './app/app.routes';

// Interceptor funcional (Angular 16+)
const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // <- usa backticks
      }
    });
  }
  return next(req);
};

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`, // <- usa backticks
})
class Root {}

bootstrapApplication(Root, {
  providers: [
    provideRouter(appRoutes),                  // <- NO es providerRouter
    provideAnimations(),                       // <- NO es providerAnimations
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
}).catch(err => console.error(err));