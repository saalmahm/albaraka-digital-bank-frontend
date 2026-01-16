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

export interface DocumentResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export interface OperationOwner {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface OperationAccount {
  id: number;
  accountNumber: string;
  balance: number;
  owner: OperationOwner;
}

export interface OperationDocument {
  id: number;
  fileName: string;
  fileType: string;
  storagePath: string;
  uploadedAt: string;
}

export interface AgentDocumentResponse {
  id: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  operationId: number;
}

export interface PendingOperation extends OperationResponse {
  accountSource: OperationAccount;
  accountDestination: OperationAccount | null;
  documents: OperationDocument[] | null;

  // Flag envoyé par l’API pour indiquer la présence de justificatif (si dispo)
  hasDocument?: boolean;

  aiDecision?: string | null;
  aiComment?: string | null;
  aiEvaluatedAt?: string | null;
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

  getPendingOperations(page = 0, size = 10): Observable<Page<PendingOperation>> {
    const url = `${this.baseUrl}/api/agent/operations/jwt/pending`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<PendingOperation>>(url, { params });
  }

  deposit(amount: number): Observable<OperationResponse> {
    const url = `${this.baseUrl}/api/client/operations`;
    const body: OperationRequest = { type: 'DEPOSIT', amount };
    return this.http.post<OperationResponse>(url, body);
  }

  withdraw(amount: number): Observable<OperationResponse> {
    const url = `${this.baseUrl}/api/client/operations`;
    const body: OperationRequest = { type: 'WITHDRAWAL', amount };
    return this.http.post<OperationResponse>(url, body);
  }

  transfer(amount: number, destinationAccountNumber: string): Observable<OperationResponse> {
    const url = `${this.baseUrl}/api/client/operations`;
    const body: OperationRequest = { type: 'TRANSFER', amount, destinationAccountNumber };
    return this.http.post<OperationResponse>(url, body);
  }

  uploadJustificatif(operationId: number, file: File): Observable<DocumentResponse> {
    const url = `${this.baseUrl}/api/client/operations/${operationId}/document`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<DocumentResponse>(url, formData);
  }

  getOperationDocuments(operationId: number): Observable<AgentDocumentResponse[]> {
    const url = `${this.baseUrl}/api/agent/operations/${operationId}/documents`;
    return this.http.get<AgentDocumentResponse[]>(url);
  }

  approveOperation(operationId: number): Observable<PendingOperation> {
    const url = `${this.baseUrl}/api/agent/operations/${operationId}/approve`;
    return this.http.put<PendingOperation>(url, {});
  }

  rejectOperation(operationId: number): Observable<PendingOperation> {
    const url = `${this.baseUrl}/api/agent/operations/${operationId}/reject`;
    return this.http.put<PendingOperation>(url, {});
  }

  downloadAgentDocument(documentId: number): Observable<Blob> {
    const url = `${this.baseUrl}/api/agent/documents/${documentId}/download`;
    return this.http.get(url, { responseType: 'blob' }) as Observable<Blob>;
  }
}