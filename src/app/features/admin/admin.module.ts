import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminShellComponent } from './components/admin-shell/admin-shell.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    AdminShellComponent,      // standalone
    UserManagementComponent,  // standalone
    UserListComponent         // standalone
  ]
})
export class AdminModule {}