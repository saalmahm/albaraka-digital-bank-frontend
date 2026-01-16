import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PendingOperation,
  AgentDocumentResponse,
  OperationService
} from '../../../../core/services/operation.service';

@Component({
  selector: 'app-operation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operation-detail.component.html',
  styleUrls: ['./operation-detail.component.css']
})
export class OperationDetailComponent {
  @Input() operation: PendingOperation | null = null;
  @Input() documents: AgentDocumentResponse[] = [];
  @Input() isLoadingDocuments = false;
  @Input() actionInProgress = false;
  @Input() actionSuccessMessage: string | null = null;
  @Input() actionErrorMessage: string | null = null;
  @Input() apiBaseUrl = '';

  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private operationService: OperationService) {}

  onApprove(): void {
    if (this.actionInProgress) return;
    this.approve.emit();
  }

  onReject(): void {
    if (this.actionInProgress) return;
    this.reject.emit();
  }

  onClose(): void {
    if (this.actionInProgress) return;
    this.close.emit();
  }

  // Bouton "Consulter" : ouvre l’image/PDF dans un nouvel onglet avec le bon type
  openDocument(doc: AgentDocumentResponse): void {
    this.actionErrorMessage = null;

    this.operationService.downloadAgentDocument(doc.id).subscribe({
      next: (blob) => {
        // Forcer le type pour que le navigateur l’interprète comme image/PDF
        const typedBlob = new Blob([blob], {
          type: doc.fileType || blob.type || 'application/octet-stream'
        });

        const blobUrl = URL.createObjectURL(typedBlob);
        window.open(blobUrl, '_blank');
      },
      error: (err) => {
        console.error('Erreur téléchargement justificatif', err);
        this.actionErrorMessage =
          err && err.error && err.error.message
            ? err.error.message
            : "Impossible de télécharger le justificatif.";
      }
    });
  }
}