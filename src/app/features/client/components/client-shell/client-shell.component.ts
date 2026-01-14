import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountResponse } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-client-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-shell.component.html',
  styleUrls: ['./client-shell.component.css']
})
export class ClientShellComponent {
  // Option simple : juste logout depuis la sidebar
  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}