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

  selectedFile: File | null = null;
  fileError: string | null = null;
  isUploading = false;
  uploadSuccessMessage: string | null = null;
  uploadErrorMessage: string | null = null;

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

  onFileSelected(event: Event): void {
    this.fileError = null;
    this.uploadSuccessMessage = null;
    this.uploadErrorMessage = null;
    this.selectedFile = null;

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Type de fichier non autorisé. Autorisés : PDF, JPEG, PNG.';
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'Le fichier dépasse la taille maximale autorisée (5 Mo).';
      return;
    }

    this.selectedFile = file;
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.lastOperation = null;
    this.uploadSuccessMessage = null;
    this.uploadErrorMessage = null;
    this.fileError = null;

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

        if (op.amount > 10000 && this.selectedFile) {
          this.isUploading = true;

          this.operationService.uploadJustificatif(op.id, this.selectedFile).subscribe({
            next: (doc) => {
              this.isUploading = false;
              this.uploadSuccessMessage =
                `Justificatif "${doc?.fileName ?? 'uploadé'}" envoyé avec succès.`;
              this.selectedFile = null;
            },
            error: (err) => {
              this.isUploading = false;
              console.log('UPLOAD JUSTIF ERROR (transfer)', err);

              if (err.status === 200) {
                this.uploadSuccessMessage = 'Justificatif envoyé avec succès.';
                this.selectedFile = null;
                return;
              }

              this.uploadErrorMessage =
                err && err.error && err.error.message
                  ? err.error.message
                  : `Erreur upload justificatif (status ${err.status})`;
            }
          });
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