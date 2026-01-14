import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { ClientShellComponent } from './components/client-shell/client-shell.component';
import { WithdrawalComponent } from './components/withdrawal/withdrawal.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ClientRoutingModule,
    ClientDashboardComponent,
    DepositComponent,
    ClientShellComponent,
    WithdrawalComponent
  ]
})
export class ClientModule {}