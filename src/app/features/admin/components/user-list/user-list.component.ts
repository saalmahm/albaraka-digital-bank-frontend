import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  UserService,
  AdminUserSummary,
  Page
} from '../../../../core/services/user.service';

type SortField = 'createdAt' | 'fullName' | 'email' | 'role';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  rawPage: Page<AdminUserSummary> | null = null;
  users: AdminUserSummary[] = [];

  // pagination
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  // états UI
  isLoading = false;
  errorMessage: string | null = null;

  // filtres front
  filterEmail = '';
  filterRole: '' | 'CLIENT' | 'AGENT_BANCAIRE' | 'ADMIN' = '';
  filterActive: '' | 'ACTIVE' | 'INACTIVE' = '';

  // tri front
  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = this.page): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getAdminUsers(page, this.size).subscribe({
      next: (response) => {
        this.rawPage = response;
        this.page = response.number;
        this.size = response.size;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;

        this.users = this.applyFiltersAndSort(response.content);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs admin', err);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = "Vous n'êtes pas autorisé à consulter la liste des utilisateurs.";
        } else {
          this.errorMessage = "Impossible de charger la liste des utilisateurs.";
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    if (!this.rawPage) return;
    this.users = this.applyFiltersAndSort(this.rawPage.content);
  }

  onSortChange(): void {
    this.onFilterChange();
  }

  private applyFiltersAndSort(list: AdminUserSummary[]): AdminUserSummary[] {
    let result = [...list];

    // filtre email / nom
    const term = this.filterEmail.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          u.fullName.toLowerCase().includes(term)
      );
    }

    // filtre rôle
    if (this.filterRole) {
      result = result.filter((u) => u.role === this.filterRole);
    }

    // filtre actif/inactif
    if (this.filterActive === 'ACTIVE') {
      result = result.filter((u) => u.active);
    } else if (this.filterActive === 'INACTIVE') {
      result = result.filter((u) => !u.active);
    }

    // tri
    result.sort((a, b) => {
      let cmp = 0;

      switch (this.sortField) {
        case 'fullName':
          cmp = a.fullName.localeCompare(b.fullName);
          break;
        case 'email':
          cmp = a.email.localeCompare(b.email);
          break;
        case 'role':
          cmp = a.role.localeCompare(b.role);
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
    if (page < 0 || (this.totalPages > 0 && page >= this.totalPages)) return;
    this.loadUsers(page);
  }

  getStatusLabel(user: AdminUserSummary): string {
    return user.active ? 'Actif' : 'Inactif';
  }

  getStatusClass(user: AdminUserSummary): string {
    return user.active ? 'badge-success' : 'badge-muted';
  }
}