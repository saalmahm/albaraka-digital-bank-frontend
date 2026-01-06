import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingOperationsComponent } from './components/pending-operations/pending-operations.component';

/**
 * Routes du domaine Agent bancaire.
 */
const routes: Routes = [
  {
    path: '',
    component: PendingOperationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule {}