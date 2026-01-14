import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OperationRequest {
  type: OperationType; // 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  amount: number;
  destinationAccountNumber?: string | null;
}
export interface AccountResponse {
  accountId: number;
  accountNumber: string;
  balance: number;
  ownerEmail: string;
  ownerFullName: string;
}

export type OperationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export type OperationType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';

export interface OperationResponse {
  id: number;
  type: OperationType;
  amount: number;
  status: OperationStatus;
  createdAt: string;
  executedAt: string | null;
  accountSourceNumber: string;
  accountDestinationNumber: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

/**
 * Service de consultation des comptes et opérations pour le client.
 */
@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMyAccount(): Observable<AccountResponse> {
    const url = `${this.baseUrl}/api/client/account/me`;
    return this.http.get<AccountResponse>(url);
  }

  getMyOperations(page = 0, size = 10): Observable<Page<OperationResponse>> {
    const url = `${this.baseUrl}/api/client/operations`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<OperationResponse>>(url, { params });
  }

deposit(amount: number, description?: string): Observable<OperationResponse> {
  const url = `${this.baseUrl}/api/client/operations`;

  const body: OperationRequest = {
    type: 'DEPOSIT',
    amount
  };
  return this.http.post<OperationResponse>(url, body);
}

withdraw(amount: number): Observable<OperationResponse> {
  const url = `${this.baseUrl}/api/client/operations`;

  const body: OperationRequest = {
    type: 'WITHDRAWAL',
    amount
  };

  return this.http.post<OperationResponse>(url, body);
}

transfer(amount: number, destinationAccountNumber: string): Observable<OperationResponse> {
  const url = `${this.baseUrl}/api/client/operations`;

  const body: OperationRequest = {
    type: 'TRANSFER',
    amount,
    destinationAccountNumber
  };

  return this.http.post<OperationResponse>(url, body);
}
}