import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

/**
 * Restringe una ruta a ciertos roles.
 * Uso: { path: 'admin', canActivate: [roleGuard(['admin'])] }
 */
export function roleGuard(roles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.role();
    if (role && roles.includes(role)) return true;
    return router.createUrlTree(['/']);
  };
}
