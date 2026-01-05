import { Routes } from '@angular/router';

/**
 * Définition des routes principales de l'application.
 * À ce stade, nous préparons simplement la structure des URLs.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth' // page d'entrée : parcours d'authentification
  },
  {
    path: 'auth',
    // Plus tard : lazy-load 
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'client',
    // Plus tard : routes pour le dashboard client et les opérations (dépôt, retrait, virement)
    loadChildren: () =>
      import('./features/client/client.routes').then((m) => m.CLIENT_ROUTES)
  },
  {
    path: 'agent',
    // Plus tard : routes pour la validation des opérations PENDING
    loadChildren: () =>
      import('./features/agent/agent.routes').then((m) => m.AGENT_ROUTES)
  },
  {
    path: 'admin',
    // Plus tard : routes pour la gestion des utilisateurs et des rôles
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth' // TODO: plus tard, créer une vraie page 404
  }
];