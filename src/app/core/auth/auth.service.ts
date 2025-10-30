// src/app/core/auth/auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuth = signal<boolean>(!!localStorage.getItem('demo_auth'));

  login(username: string, _password: string) {
    // aquí luego reemplazas por Keycloak
    if (username.trim()) {
      localStorage.setItem('demo_auth', '1');
      this.isAuth.set(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('demo_auth');
    this.isAuth.set(false);
  }
}
