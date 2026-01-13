import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  roles?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DecodedToken {
  sub: string;
  iat?: number;
  exp?: number;
  roles?: string[]; 
}

/**
 * Service d'authentification 
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'albaraka_token';

  private readonly apiUrl = `${environment.apiBaseUrl}/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap((response) => {
        this.storeToken(response.token);
      })
    );
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = atob(parts[1]);
      return JSON.parse(payload) as DecodedToken;
    } catch {
      return null;
    }
  }

  getRolesFromToken(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) {
      return [];
    }

    if (Array.isArray(decoded.roles)) {
      return decoded.roles;
    }

    return [];
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}