import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';

/**
 * ClientModule
 * - Gère le dashboard client et les opérations (dépôt, retrait, virement).
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule,
    ClientDashboardComponent,
    DepositComponent
  ]
})
export class ClientModule {}