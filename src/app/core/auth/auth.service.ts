// src/app/core/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/app/environments/environment';
import { KeycloakService } from '@/app/core/keycloak/keycloak.service';

export interface MenuUserRaw {
  [module: string]: string[]; // p.ej. { PRICING: ["/pricing/promotions,Validar Promociones"] }
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  menu_user?: MenuUserRaw;
}

const MENU_STORAGE_KEY = 'menu_user';
const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authConfig = environment.auth;
  private baseUrl = this.authConfig.baseUrl;
  constructor(private keycloakService: KeycloakService) {}

  isAuth(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;
    return !this.isExpired(token);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('client_id', this.authConfig.clientId)
      .set('client_secret', this.authConfig.clientSecret)
      .set('realm_name', this.authConfig.realm);

    return this.http.post<LoginResponse>(this.baseUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  afterLoginStore(res: LoginResponse) {
    localStorage.setItem('access_token', res.access_token);
    let menu = res.menu_user ?? null;
    if (!menu) {
      const fromToken = this.getClaim<MenuUserRaw>('menu_user');
      if (fromToken) menu = fromToken;
    }
    if (menu) this.setMenuFromResponse(menu);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(MENU_STORAGE_KEY);
    return this.keycloakService.logout(window.location.origin + '/login');
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

  hasRole(role: string, resource: string) {
    return this.keycloakService.hasAnyRole(resource, [role]);
  }
  hasAny(resource: string, roles: string[]) {
    return this.keycloakService.hasAnyRole(resource, roles);
  }

  getUsername() {
    return this.keycloakService.username;
  }
  getRealmRoles() {
    return this.keycloakService.getRealmRoles();
  }
  getClientRoles(clientId: string) {
    return this.keycloakService.getClientRoles(clientId);
  }
  getAllRoles() {
    return this.keycloakService.getAllRoles();
  }

  get token(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
  }

  private decodeJwt(t?: string): Record<string, any> | null {
    const token = t ?? this.token;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getClaim<T = any>(claim: string): T | null {
    const payload = this.decodeJwt();
    return payload && claim in payload ? (payload[claim] as T) : null;
  }

  getDisplayName(): string {
    const given = this.getClaim<string>('given_name') ?? this.getClaim<string>('givenname');
    const family = this.getClaim<string>('family_name');
    const full = this.getClaim<string>('name');
    const user = this.getClaim<string>('preferred_username');
    if (given && family) return `${given} ${family}`;
    if (given) return given;
    if (full) return full;
    if (user) return user;
    return 'Usuario';
  }

  getEmail(): string | null {
    return this.getClaim<string>('email');
  }

  getInitials(fromName?: string): string {
    const name = (fromName ?? this.getDisplayName()).trim();
    if (!name) return 'U';
    const parts = name.split(/\s+/).slice(0, 2);
    const ini = parts
      .map((p) => p.charAt(0))
      .join('')
      .toUpperCase();
    return ini || 'U';
  }

  setMenuFromResponse(menu?: MenuUserRaw | null) {
    if (!menu) return;
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  }

  getStoredMenu(): MenuUserRaw | null {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as MenuUserRaw;
    } catch {
      return null;
    }
  }

  hasMenuArea(area: string): boolean {
    const menu = this.getStoredMenu() ?? {};
    return !!menu[area]?.length;
  }

  hasMenuItem(area: string, opts: { path?: string; label?: string }): boolean {
    const lines = (this.getStoredMenu() ?? {})[area] ?? [];
    return lines.some((line) => {
      const [path, label] = (line ?? '').split(',');
      return (
        (opts.path && opts.path === path?.trim()) || (opts.label && opts.label === label?.trim())
      );
    });
  }

  getMenuAreaItems(area: string): { path: string; label: string }[] {
    const lines = (this.getStoredMenu() ?? {})[area] ?? [];
    return lines
      .map((line) => {
        const [path, label] = (line ?? '').split(',');
        return { path: (path ?? '').trim(), label: (label ?? '').trim() };
      })
      .filter((it) => it.path && it.label);
  }
}
