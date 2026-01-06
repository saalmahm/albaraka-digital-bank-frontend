import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementComponent } from './components/user-management/user-management.component';

/**
 * AdminModule
 * - Gère la gestion des utilisateurs et des rôles.
 */
@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}