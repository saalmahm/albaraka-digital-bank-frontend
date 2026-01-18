import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      {
        path: '',
        component: UserManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}