import { Routes } from '@angular/router';
import { authRoleGuard } from './core/guards/auth-role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'client',
    canActivate: [authRoleGuard],
    data: { roles: ['CLIENT'] }, // à adapter si ton backend met autre chose
    loadChildren: () =>
      import('./features/client/client.module').then((m) => m.ClientModule)
  },
  {
    path: 'agent',
    canActivate: [authRoleGuard],
    data: { roles: ['AGENT_BANCAIRE'] }, // <-- IMPORTANT : même nom que dans le token
    loadChildren: () =>
      import('./features/agent/agent.module').then((m) => m.AgentModule)
  },
  {
    path: 'admin',
    canActivate: [authRoleGuard],
    data: { roles: ['ADMIN'] }, // adapter si besoin (ROLE_ADMIN, etc.)
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];