import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationService, OperationResponse } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  depositForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastOperation: OperationResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private operationService: OperationService
  ) {
    this.depositForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  get f() {
    return this.depositForm.controls;
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.lastOperation = null;

    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }

    const { amount } = this.depositForm.value;
    this.isSubmitting = true;

    this.operationService.deposit(amount).subscribe({
      next: (op) => {
        this.isSubmitting = false;
        this.lastOperation = op;

        // Message en fonction du statut
        if (op.status === 'VALIDATED') {
          this.successMessage = `Dépôt de ${op.amount} DH validé (statut: ${op.status}).`;
        } else {
          this.successMessage = `Dépôt de ${op.amount} DH enregistré (statut: ${op.status}).`;
        }

        this.depositForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 400) {
          this.errorMessage = 'Données invalides pour le dépôt.';
        } else if (err.status === 403) {
          this.errorMessage = "Vous n'êtes pas autorisé à effectuer ce dépôt.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'envoi du dépôt.";
        }
      }
    });
  }
}