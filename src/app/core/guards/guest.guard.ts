import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Pantallas solo para visitantes (login, recuperar, registro): con la sesion
 * abierta se va directo al inicio, en lugar de dejar registrarse otra vez.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn()) return true;
  return inject(Router).createUrlTree([auth.homeUrl()]);
};
