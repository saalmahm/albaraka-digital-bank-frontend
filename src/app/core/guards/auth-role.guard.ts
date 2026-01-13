import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * RoleGuard :
 * - suppose que l'utilisateur est déjà authentifié
 * - vérifie qu'il possède au moins un des rôles demandés dans route.data.roles
 * - redirige vers /forbidden si rôle insuffisant
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRoles = authService.getRolesFromToken(); // ex: ['AGENT_BANCAIRE']
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // Si aucune contrainte de rôles → accès libre
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRequiredRole = userRoles.some((r) => requiredRoles.includes(r));

  if (!hasRequiredRole) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};