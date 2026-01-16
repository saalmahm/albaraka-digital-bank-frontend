import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PendingOperationsComponent } from './components/pending-operations/pending-operations.component';
import { AgentShellComponent } from './components/agent-shell/agent-shell.component';

/**
 * AgentModule
 * - Gère la validation des opérations en attente (PENDING) par l'agent bancaire.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AgentRoutingModule,
    AgentShellComponent,
    PendingOperationsComponent
  ]
})
export class AgentModule {}