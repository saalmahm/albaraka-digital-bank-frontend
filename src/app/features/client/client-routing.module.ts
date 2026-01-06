import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';

/**
 * Routes du domaine Client (dashboard, opérations).
 */
const routes: Routes = [
  {
    path: '',
    component: ClientDashboardComponent
  }
  // Plus tard : routes enfants pour dépôt, retrait, virement...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}