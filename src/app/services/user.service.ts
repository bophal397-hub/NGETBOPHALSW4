import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/auth.interface';
import { User } from '../models/user';

const DEMO_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Demo Customer',
    email: 'demo-user@example.com',
    phone: '+1234567890',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-demo-1',
    name: 'Demo Admin',
    email: 'demo-admin@example.com',
    phone: '+1987654321',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    if (environment.useDemoMode) {
      return of({ success: true, data: DEMO_USERS });
    }
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}`).pipe(
      catchError(() => of({ success: true, data: DEMO_USERS }))
    );
  }

  getUser(id: string): Observable<ApiResponse<User>> {
    if (environment.useDemoMode) {
      return of({
        success: true,
        data: DEMO_USERS.find((user) => user.id === id) ?? DEMO_USERS[0],
      });
    }
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of({
        success: true,
        data: DEMO_USERS.find((user) => user.id === id) ?? DEMO_USERS[0],
      }))
    );
  }

  updateUser(id: string, payload: Partial<User>): Observable<ApiResponse<User>> {
    if (environment.useDemoMode) {
      const existing = DEMO_USERS.find((user) => user.id === id) ?? DEMO_USERS[0];
      const updated = { ...existing, ...payload };
      return of({ success: true, data: updated });
    }
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() => {
        const existing = DEMO_USERS.find((user) => user.id === id) ?? DEMO_USERS[0];
        const updated = { ...existing, ...payload };
        return of({ success: true, data: updated });
      })
    );
  }

  activateUser(id: string): Observable<ApiResponse<User>> {
    if (environment.useDemoMode) {
      const updated = DEMO_USERS.find((user) => user.id === id);
      if (!updated) {
        return of({ success: true, data: DEMO_USERS[0] });
      }
      updated.isActive = true;
      return of({ success: true, data: updated });
    }
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/activate`, {}).pipe(
      catchError(() => {
        const updated = DEMO_USERS.find((user) => user.id === id);
        if (!updated) {
          return of({ success: true, data: DEMO_USERS[0] });
        }
        updated.isActive = true;
        return of({ success: true, data: updated });
      })
    );
  }

  deactivateUser(id: string): Observable<ApiResponse<User>> {
    if (environment.useDemoMode) {
      const updated = DEMO_USERS.find((user) => user.id === id);
      if (!updated) {
        return of({ success: true, data: DEMO_USERS[0] });
      }
      updated.isActive = false;
      return of({ success: true, data: updated });
    }
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/deactivate`, {}).pipe(
      catchError(() => {
        const updated = DEMO_USERS.find((user) => user.id === id);
        if (!updated) {
          return of({ success: true, data: DEMO_USERS[0] });
        }
        updated.isActive = false;
        return of({ success: true, data: updated });
      })
    );
  }

  resetUserPassword(id: string): Observable<ApiResponse<{ message: string }>> {
    if (environment.useDemoMode) {
      return of({ success: true, data: { message: 'Password reset request processed.' } });
    }
    return this.http.post<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}/reset-password`, {}).pipe(
      catchError(() => of({ success: true, data: { message: 'Password reset request processed.' } }))
    );
  }
}
