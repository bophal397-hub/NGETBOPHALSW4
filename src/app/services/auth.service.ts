import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from '../interfaces/auth.interface';
import { User } from '../models/user';

const DEV_ACCOUNTS: Record<string, AuthResponse> = {
  'demo-user@example.com': {
    accessToken: 'dev-user-token',
    user: {
      id: 'user-demo-1',
      name: 'Demo Customer',
      email: 'demo-user@example.com',
      phone: '+1234567890',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  },
  'demo-admin@example.com': {
    accessToken: 'dev-admin-token',
    user: {
      id: 'admin-demo-1',
      name: 'Demo Admin',
      email: 'demo-admin@example.com',
      phone: '+1987654321',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'setec_auth_state';
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(this.hasStoredSession());
  readonly userRole = signal<'user' | 'admin'>(this.getStoredUser()?.role ?? 'user');
  readonly loading = signal(false);

  private readonly authStateSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredAuthState());
  readonly authState$ = this.authStateSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    this.loading.set(true);

    if (environment.useDemoMode) {
      const devAccount = DEV_ACCOUNTS[payload.email?.trim().toLowerCase() ?? ''];
      if (devAccount && payload.password === '123456') {
        return of(devAccount).pipe(
          tap((response) => this.setSession(response)),
          catchError((error) => {
            this.loading.set(false);
            throw error;
          })
        );
      }

      if (!devAccount && payload.password === '123456') {
        const fallbackUser: User = {
          id: `user-${Date.now()}`,
          name: payload.email.split('@')[0] || 'New User',
          email: payload.email,
          phone: '',
          role: 'user',
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        const fallbackResponse: AuthResponse = {
          accessToken: 'dev-user-token',
          user: fallbackUser,
        };

        return of(fallbackResponse).pipe(
          tap((response) => this.setSession(response)),
          catchError((error) => {
            this.loading.set(false);
            throw error;
          })
        );
      }
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        this.loading.set(false);
        throw error;
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    this.loading.set(true);
    if (environment.useDemoMode) {
      const demoUser: User = {
        id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? '',
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const demoResponse: AuthResponse = {
        accessToken: 'dev-register-token',
        user: demoUser,
      };

      return of(demoResponse).pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          this.loading.set(false);
          throw error;
        })
      );
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        this.loading.set(false);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.userRole.set('user');
    this.authStateSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<{ message: string }> {
    if (environment.useDemoMode) {
      return of({ message: `A reset link has been prepared for ${payload.email}.` });
    }
    return this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<{ message: string }> {
    if (environment.useDemoMode) {
      return of({ message: 'Password reset successful.' });
    }
    return this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
    if (environment.useDemoMode) {
      return of({ message: 'Password updated successfully.' });
    }
    return this.http.post<{ message: string }>(`${this.baseUrl}/change-password`, payload);
  }

  private setSession(authResponse: AuthResponse): void {
    const cleanUser = {
      ...authResponse.user,
      role: authResponse.user.role ?? 'user',
      isActive: authResponse.user.isActive ?? true,
      createdAt: authResponse.user.createdAt ?? new Date().toISOString(),
    };

    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        user: cleanUser,
      })
    );

    this.currentUser.set(cleanUser);
    this.isAuthenticated.set(true);
    this.userRole.set(cleanUser.role);
    this.loading.set(false);
    this.authStateSubject.next(authResponse);
  }

  private getStoredUser(): User | null {
    const authState = this.getStoredAuthState();
    return authState?.user ?? null;
  }

  private getStoredAuthState(): AuthResponse | null {
    try {
      const value = localStorage.getItem(this.storageKey);
      if (!value) {
        return null;
      }

      const parsed = JSON.parse(value) as { accessToken?: string; refreshToken?: string; user?: User };
      if (!parsed.accessToken || !parsed.user) {
        return null;
      }

      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        user: parsed.user,
      };
    } catch {
      return null;
    }
  }

  private hasStoredSession(): boolean {
    return !!this.getStoredAuthState();
  }
}
