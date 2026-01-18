import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUserSummary {
  id: number;
  email: string;
  fullName: string;
  role: 'CLIENT' | 'AGENT_BANCAIRE' | 'ADMIN';
  active: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAdminUsers(page = 0, size = 10): Observable<Page<AdminUserSummary>> {
    const url = `${this.baseUrl}/api/admin/users`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<AdminUserSummary>>(url, { params });
  }
}