import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';

/**
  la liste des utilisateurs et les actions d'administration.
 */
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, UserListComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {}