import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PendingOperationsComponent } from './components/pending-operations/pending-operations.component';

/**
 * AgentModule
 * - Gère la validation des opérations en attente
 */
@NgModule({
  declarations: [
    PendingOperationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AgentRoutingModule
  ]
})
export class AgentModule {}