import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Maneja errores HTTP globales: un 401 con sesion abierta significa que el
 * token vencio o se invalido, asi que se cierra la sesion y se vuelve al
 * login recordando a donde iba el usuario.
 *
 * El 401 del propio login (contrasena incorrecta) no cuenta: lo trata la
 * pantalla de ingreso.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const esLogin = req.url.endsWith('/usuarios/login');
      if (err.status === 401 && !esLogin && auth.isLoggedIn()) {
        auth.logout();
        const actual = router.url.startsWith('/auth') ? undefined : router.url;
        router.navigate(['/auth/login'], { queryParams: { redirect: actual, motivo: 'sesion' } });
      }
      return throwError(() => err);
    }),
  );
};
