import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationService, OperationResponse } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent {
  withdrawalForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastOperation: OperationResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private operationService: OperationService
  ) {
    this.withdrawalForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  get f() {
    return this.withdrawalForm.controls;
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.lastOperation = null;

    if (this.withdrawalForm.invalid) {
      this.withdrawalForm.markAllAsTouched();
      return;
    }

    const { amount } = this.withdrawalForm.value;
    this.isSubmitting = true;

    this.operationService.withdraw(amount).subscribe({
      next: (op) => {
        this.isSubmitting = false;
        this.lastOperation = op;

        if (op.status === 'VALIDATED') {
          this.successMessage = `Retrait de ${op.amount} DH validé (statut: ${op.status}).`;
        } else {
          this.successMessage = `Retrait de ${op.amount} DH enregistré (statut: ${op.status}).`;
        }

        this.withdrawalForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 400 && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 403) {
          this.errorMessage = "Vous n'êtes pas autorisé à effectuer ce retrait.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'envoi du retrait.";
        }
      }
    });
  }
}