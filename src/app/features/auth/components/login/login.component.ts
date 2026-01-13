import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * LoginComponent
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginRequest = this.loginForm.value;
    this.isSubmitting = true;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isSubmitting = false;

        const roles = this.authService.getRolesFromToken();

        if (roles.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        } else if (roles.includes('AGENT_BANCAIRE')) {
          this.router.navigate(['/agent']);
        } else {
          // Par défaut, on considère que c'est un client
          this.router.navigate(['/client']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la connexion.';
        }
      }
    });
  }
}