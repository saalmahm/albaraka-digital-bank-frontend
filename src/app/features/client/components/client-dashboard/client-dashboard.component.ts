import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../../../core/services/auth.service';
import { OperationService, AccountResponse, OperationResponse } from '../../../../core/services/operation.service';
@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})

export class ClientDashboardComponent implements OnInit {
  account: AccountResponse | null = null;
  operations: OperationResponse[] = [];

  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  isLoadingAccount = false;
  isLoadingOperations = false;
  errorAccount: string | null = null;
  errorOperations: string | null = null;

  constructor(
    private operationService: OperationService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadAccount();
    this.loadOperations();
  }
  onLogout(): void {
    this.authService.logout();
  }
  loadAccount(): void {
    this.isLoadingAccount = true;
    this.errorAccount = null;

    this.operationService.getMyAccount().subscribe({
      next: (account) => {
        this.account = account;
      },
      error: () => {
        this.errorAccount = 'Impossible de charger les informations du compte.';
      },
      complete: () => {
        this.isLoadingAccount = false;
      }
    });
  }

  loadOperations(page: number = this.page): void {
    this.isLoadingOperations = true;
    this.errorOperations = null;

    this.operationService.getMyOperations(page, this.size).subscribe({
      next: (response) => {
        this.operations = response.content;
        this.page = response.number;
        this.size = response.size;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.computeStats(); 
      },
      error: () => {
        this.errorOperations = "Impossible de charger l'historique des opérations.";
      },
      complete: () => {
        this.isLoadingOperations = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    this.loadOperations(page);
  }

  pendingCount = 0;
  validatedDepositsCount = 0;

  private computeStats(): void {
    this.pendingCount = this.operations.filter((op) => op.status === 'PENDING').length;

    this.validatedDepositsCount = this.operations.filter(
      (op) => op.type === 'DEPOSIT' && op.status === 'VALIDATED'
    ).length;
  }
}