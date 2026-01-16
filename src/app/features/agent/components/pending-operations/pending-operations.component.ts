import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  OperationService,
  PendingOperation,
  Page
} from '../../../../core/services/operation.service';

interface PendingOperationView {
  id: number;
  type: string;
  amount: number;
  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  createdAt: string;
  clientFullName: string;
  clientEmail: string;
  hasDocument: boolean;
  aiDecision?: string | null;
  aiComment?: string | null;
}

type SortField = 'createdAt' | 'amount' | 'clientFullName' | 'type';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-pending-operations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-operations.component.html',
  styleUrls: ['./pending-operations.component.css']
})
export class PendingOperationsComponent implements OnInit {
  // Données
  rawPage: Page<PendingOperation> | null = null;
  operations: PendingOperationView[] = [];

  // Pagination
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  // États UI
  isLoading = false;
  errorMessage: string | null = null;

  // Filtres simples
  filterType: '' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' = '';
  filterClient = '';

  // Tri simple
  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.loadPendingOperations();
  }

  loadPendingOperations(page: number = this.page): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.operationService.getPendingOperations(page, this.size).subscribe({
      next: (response) => {
        this.rawPage = response;
        this.page = response.number;
        this.size = response.size;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        const mapped = response.content.map((op) => this.mapToView(op));
        this.operations = this.applyFiltersAndSort(mapped);
      },
      error: (err) => {
        console.error('Erreur chargement opérations PENDING', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = "Vous n'êtes pas autorisé à consulter ces opérations.";
        } else {
          this.errorMessage = "Impossible de charger la liste des opérations PENDING.";
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private mapToView(op: PendingOperation): PendingOperationView {
    const owner = op.accountSource?.owner;
    return {
      id: op.id,
      type: op.type,
      amount: op.amount,
      status: op.status,
      createdAt: op.createdAt,
      clientFullName: owner?.fullName ?? '—',
      clientEmail: owner?.email ?? '—',
      hasDocument: !!op.documents && op.documents.length > 0,
      aiDecision: op.aiDecision ?? null,
      aiComment: op.aiComment ?? null
    };
  }

  onFilterChange(): void {
    if (!this.rawPage) {
      return;
    }
    const mapped = this.rawPage.content.map((op) => this.mapToView(op));
    this.operations = this.applyFiltersAndSort(mapped);
  }

  onSortChange(): void {
    this.onFilterChange();
  }

  private applyFiltersAndSort(list: PendingOperationView[]): PendingOperationView[] {
    let result = [...list];

    // Filtre type
    if (this.filterType) {
      result = result.filter((op) => op.type === this.filterType);
    }

    // Filtre client (nom ou email)
    const term = this.filterClient.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (op) =>
          op.clientFullName.toLowerCase().includes(term) ||
          op.clientEmail.toLowerCase().includes(term)
      );
    }

    // Tri
    result.sort((a, b) => {
      let cmp = 0;

      switch (this.sortField) {
        case 'amount':
          cmp = a.amount - b.amount;
          break;
        case 'clientFullName':
          cmp = a.clientFullName.localeCompare(b.clientFullName);
          break;
        case 'type':
          cmp = a.type.localeCompare(b.type);
          break;
        case 'createdAt':
        default:
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return this.sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }

  goToPage(page: number): void {
    if (page < 0 || (this.totalPages > 0 && page >= this.totalPages)) {
      return;
    }
    this.loadPendingOperations(page);
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }
}