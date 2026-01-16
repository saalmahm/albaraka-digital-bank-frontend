import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-agent-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-shell.component.html',
  styleUrls: ['./agent-shell.component.css']
})
export class AgentShellComponent {
  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}