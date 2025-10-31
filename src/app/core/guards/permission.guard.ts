import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/app/core/auth/auth.service';

// En la ruta: data: { required: { resource: '...', roles: ['...'] } }
export const permissionGuard: CanActivateFn = (route) => {
  const required = route.data?.['required'] as { resource: string; roles: string[] } | undefined;
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!required || auth.hasAny(required.resource, required.roles)) return true;
  router.navigateByUrl('/'); // o /forbidden
  return false;
};
