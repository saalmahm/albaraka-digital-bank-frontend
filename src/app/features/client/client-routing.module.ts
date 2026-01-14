import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { ClientShellComponent } from './components/client-shell/client-shell.component';
import { WithdrawalComponent } from './components/withdrawal/withdrawal.component';

const routes: Routes = [
  {
    path: '',
    component: ClientShellComponent,
    children: [
      { path: '', component: ClientDashboardComponent },
      { path: 'deposit', component: DepositComponent },
      { path: 'withdraw', component: WithdrawalComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}