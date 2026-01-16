import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingOperationsComponent } from './components/pending-operations/pending-operations.component';
import { AgentShellComponent } from './components/agent-shell/agent-shell.component';

/**
 * Routes du domaine Agent bancaire.
 */
const routes: Routes = [
  {
    path: '',
    component: AgentShellComponent,
    children: [
      { path: '', component: PendingOperationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule {}