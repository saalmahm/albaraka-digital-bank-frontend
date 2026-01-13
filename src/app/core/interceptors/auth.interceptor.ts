import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Intercepteur HTTP JWT :
 * - ajoute le header Authorization: Bearer <token> sur les appels sécurisés
 * - intercepte les 401/403 pour forcer un logout + redirection vers /auth
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  let authReq: HttpRequest<unknown> = req;

  const isAuthLogin = req.url.includes('/auth/login');

  if (token && !isAuthLogin) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Token expiré ou non autorisé → on nettoie et on renvoie au login
        authService.logout(); // supprime le token + navigate('/auth')
      }

      return throwError(() => error);
    })
  );
};