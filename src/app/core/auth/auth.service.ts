// src/app/core/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@/app/environments/environment';

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authCfg = environment.auth;
  private baseUrl = this.authCfg.baseUrl;

  isAuth(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    return !this.isExpired(token);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('client_id', this.authCfg.clientId)
      .set('client_secret', this.authCfg.clientSecret)
      .set('realm_name', this.authCfg.realm);

    return this.http.post<LoginResponse>(this.baseUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload?.exp;
      if (!exp) return false;
      const nowSeconds = Math.floor(Date.now() / 1000);
      return nowSeconds >= exp;
    } catch {
      return true;
    }
  }
}
