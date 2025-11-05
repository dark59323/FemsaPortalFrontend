import { Injectable } from '@angular/core';
import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak!: Keycloak;

  async init(
    config: KeycloakConfig,
    options: KeycloakInitOptions = { onLoad: 'login-required', checkLoginIframe: false }
  ) {
    this.keycloak = new Keycloak(config);
    await this.keycloak.init(options);
  }

  async logout(redirectUri: string = window.location.origin + '/login'): Promise<void> {
    if (!this.keycloak) {
      localStorage.clear();
      window.location.href = redirectUri;
      return;
    }
    await this.keycloak.logout({ redirectUri });
  }

  get tokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloak?.tokenParsed;
  }

  get username(): string {
    const u = this.keycloak?.tokenParsed?.['preferred_username'] as string | undefined;
    return u ?? '';
  }

  hasAnyRole(resource: string, roles: string[]): boolean {
    if (!roles?.length || !this.keycloak) return true;
    const ra = this.keycloak.resourceAccess?.[resource]?.roles ?? [];
    return roles.some((r) => ra.includes(r));
  }
  getRealmRoles(): string[] {
    return this.keycloak?.realmAccess?.roles ?? [];
  }

  getClientRoles(clientId: string): string[] {
    return this.keycloak?.resourceAccess?.[clientId]?.roles ?? [];
  }

  getAllRoles(): string[] {
    const realm = this.getRealmRoles();
    const clients = Object.keys(this.keycloak?.resourceAccess ?? {}).flatMap((c) =>
      (this.keycloak!.resourceAccess![c].roles ?? []).map((r) => `${c}:${r}`)
    );
    return [...realm, ...clients];
  }
}
