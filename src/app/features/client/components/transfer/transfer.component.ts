import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationService, OperationResponse } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  transferForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  lastOperation: OperationResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private operationService: OperationService
  ) {
    this.transferForm = this.fb.group({
      destinationAccountNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(34),
          Validators.pattern(/^[A-Z0-9\-]+$/i)
        ]
      ],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      reason: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.transferForm.controls;
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.lastOperation = null;

    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const { destinationAccountNumber, amount } = this.transferForm.value;
    this.isSubmitting = true;

    this.operationService.transfer(amount, destinationAccountNumber).subscribe({
      next: (op) => {
        this.isSubmitting = false;
        this.lastOperation = op;

        if (op.status === 'VALIDATED') {
          this.successMessage = `Virement de ${op.amount} DH validé (statut : ${op.status}).`;
        } else {
          this.successMessage = `Virement de ${op.amount} DH enregistré (statut : ${op.status}).`;
        }

        this.transferForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 400 && err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 403) {
          this.errorMessage = "Vous n'êtes pas autorisé à effectuer ce virement.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'envoi du virement.";
        }
      }
    });
  }
}