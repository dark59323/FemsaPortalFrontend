import { Injectable } from '@angular/core';
import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
    private kc!: Keycloak;

    async init(config: KeycloakConfig, options: KeycloakInitOptions = { onLoad: 'login-required', checkLoginIframe: false }) {
        this.kc = new Keycloak(config);
        await this.kc.init(options);
    }

    logout(redirectUri?: string) {
        return this.kc.logout({ redirectUri });
    }

    get tokenParsed(): KeycloakTokenParsed | undefined {
        return this.kc?.tokenParsed;
    }

    get username(): string {
        // 👇 acceso por índice para calmar al TS estricto
        const u = this.kc?.tokenParsed?.['preferred_username'] as string | undefined;
        return u ?? '';
    }

    hasAnyRole(resource: string, roles: string[]): boolean {
        if (!roles?.length || !this.kc) return true;
        const ra = this.kc.resourceAccess?.[resource]?.roles ?? [];
        return roles.some(r => ra.includes(r));
    }
     getRealmRoles(): string[] {
    return this.kc?.realmAccess?.roles ?? [];
  }

  getClientRoles(clientId: string): string[] {
    return this.kc?.resourceAccess?.[clientId]?.roles ?? [];
  }

  getAllRoles(): string[] {
    const realm = this.getRealmRoles();
    const clients = Object.keys(this.kc?.resourceAccess ?? {}).flatMap(
      c => (this.kc!.resourceAccess![c].roles ?? []).map(r => `${c}:${r}`)
    );
    return [...realm, ...clients];
  }
}
