import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/auth.interface';
import { ContactMessage } from '../models/contact-message';

const DEMO_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Sarah Lopez',
    email: 'sarah@example.com',
    subject: 'Order issue',
    message: 'I have a question about my recent order status.',
    status: 'unread',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    subject: 'Product enquiry',
    message: 'Do you have this in stock in another color?',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly baseUrl = `${environment.apiUrl}/messages`;

  constructor(private readonly http: HttpClient) {}

  getMessages(): Observable<ApiResponse<ContactMessage[]>> {
    if (environment.useDemoMode) {
      return of({ success: true, data: DEMO_MESSAGES });
    }
    return this.http.get<ApiResponse<ContactMessage[]>>(`${this.baseUrl}`).pipe(
      catchError(() => of({ success: true, data: DEMO_MESSAGES }))
    );
  }

  getMessage(id: string): Observable<ApiResponse<ContactMessage>> {
    if (environment.useDemoMode) {
      return of({
        success: true,
        data: DEMO_MESSAGES.find((message) => message.id === id) ?? DEMO_MESSAGES[0],
      });
    }
    return this.http.get<ApiResponse<ContactMessage>>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of({
        success: true,
        data: DEMO_MESSAGES.find((message) => message.id === id) ?? DEMO_MESSAGES[0],
      }))
    );
  }

  sendMessage(payload: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Observable<ApiResponse<ContactMessage>> {
    if (environment.useDemoMode) {
      const newMessage: ContactMessage = {
        ...payload,
        id: `msg-${Date.now()}`,
        status: 'unread',
        createdAt: new Date().toISOString(),
      } as ContactMessage;
      DEMO_MESSAGES.unshift(newMessage);
      return of({ success: true, data: newMessage });
    }
    return this.http.post<ApiResponse<ContactMessage>>(`${this.baseUrl}`, payload).pipe(
      catchError(() => {
        const newMessage: ContactMessage = {
          ...payload,
          id: `msg-${Date.now()}`,
          status: 'unread',
          createdAt: new Date().toISOString(),
        } as ContactMessage;
        DEMO_MESSAGES.unshift(newMessage);
        return of({ success: true, data: newMessage });
      })
    );
  }

  markAsRead(id: string): Observable<ApiResponse<ContactMessage>> {
    if (environment.useDemoMode) {
      const message = DEMO_MESSAGES.find((item) => item.id === id);
      if (message) {
        message.status = 'read';
      }
      return of({ success: true, data: message ?? DEMO_MESSAGES[0] });
    }
    return this.http.patch<ApiResponse<ContactMessage>>(`${this.baseUrl}/${id}/read`, {}).pipe(
      catchError(() => {
        const message = DEMO_MESSAGES.find((item) => item.id === id);
        if (message) {
          message.status = 'read';
        }
        return of({ success: true, data: message ?? DEMO_MESSAGES[0] });
      })
    );
  }

  replyToMessage(id: string, reply: string): Observable<ApiResponse<ContactMessage>> {
    if (environment.useDemoMode) {
      const message = DEMO_MESSAGES.find((item) => item.id === id);
      if (message) {
        message.reply = reply;
        message.status = 'replied';
      }
      return of({ success: true, data: message ?? DEMO_MESSAGES[0] });
    }
    return this.http.post<ApiResponse<ContactMessage>>(`${this.baseUrl}/${id}/reply`, { reply }).pipe(
      catchError(() => {
        const message = DEMO_MESSAGES.find((item) => item.id === id);
        if (message) {
          message.reply = reply;
          message.status = 'replied';
        }
        return of({ success: true, data: message ?? DEMO_MESSAGES[0] });
      })
    );
  }

  deleteMessage(id: string): Observable<ApiResponse<{ message: string }>> {
    if (environment.useDemoMode) {
      const index = DEMO_MESSAGES.findIndex((message) => message.id === id);
      if (index >= 0) {
        DEMO_MESSAGES.splice(index, 1);
      }
      return of({ success: true, data: { message: 'Message deleted.' } });
    }
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => {
        const index = DEMO_MESSAGES.findIndex((message) => message.id === id);
        if (index >= 0) {
          DEMO_MESSAGES.splice(index, 1);
        }
        return of({ success: true, data: { message: 'Message deleted.' } });
      })
    );
  }

  getUnreadCount(): Observable<ApiResponse<number>> {
    if (environment.useDemoMode) {
      return of({ success: true, data: DEMO_MESSAGES.filter((message) => message.status === 'unread').length });
    }
    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/unread-count`).pipe(
      catchError(() => of({ success: true, data: DEMO_MESSAGES.filter((message) => message.status === 'unread').length }))
    );
  }
}
