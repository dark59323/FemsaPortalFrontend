import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/app/core/auth/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const auth   = inject(AuthService);

  const reqRoles = route.data?.['required'] as { resource: string; roles: string[] } | undefined;
  const reqMenu  = route.data?.['menu'] as { area: string; path?: string; label?: string } | undefined;

  const rolesOk = !reqRoles || auth.hasAny(reqRoles.resource, reqRoles.roles);

  let menuOk = true;
  if (reqMenu?.area) {
    menuOk = reqMenu.path || reqMenu.label
      ? auth.hasMenuItem(reqMenu.area, { path: reqMenu.path, label: reqMenu.label })
      : auth.hasMenuArea(reqMenu.area);
  }

  const ok = rolesOk && menuOk;
  if (!ok) {
    router.navigateByUrl('/forbidden'); // crea una página simple o redirige a dashboard
    return false;
  }
  return true;
};
