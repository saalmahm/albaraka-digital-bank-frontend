import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pas de token → on renvoie au login
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth']);
    return false;
  }

  const userRoles = authService.getRolesFromToken(); // ex: ['AGENT']
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Si aucune contrainte de rôles → accès autorisé
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRequiredRole = userRoles.some((r) => requiredRoles.includes(r));

  if (!hasRequiredRole) {
    // (login, home...)
    router.navigate(['/auth']);
    return false;
  }

  return true;
};