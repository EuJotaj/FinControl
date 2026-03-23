import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '@stomp/stompjs';
import { Notification } from '../models/notification.model';
import { AuthService } from './auth.service';

// SockJS declared via @types/sockjs-client
declare const SockJS: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private readonly apiUrl = 'http://localhost:8080/api/notifications';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly unreadCount$: Observable<number>;

  private stompClient: Client | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.unreadCount$ = this.notifications$.pipe(
      map(list => list.filter(n => !n.isRead).length)
    );

    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadNotifications();
      this.connectWebSocket(user.email);
    }
  }

  private loadNotifications(): void {
    this.http.get<Notification[]>(this.apiUrl).subscribe({
      next: notifications => this.notificationsSubject.next(notifications),
      error: err => console.warn('Notificações:', err.message)
    });
  }

  private connectWebSocket(userEmail: string): void {
    const token = this.authService.getToken();

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-notifications'),
      connectHeaders: { Authorization: `Bearer ${token ?? ''}` },
      reconnectDelay: 5000,
      onConnect: () => {
        this.stompClient?.subscribe(
          `/user/${userEmail}/topic/notifications`,
          message => {
            try {
              const notification: Notification = JSON.parse(message.body);
              this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
            } catch (e) { /* ignore */ }
          }
        );
      },
      onStompError: frame => console.warn('STOMP error:', frame.headers['message'])
    });

    this.stompClient.activate();
  }

  markAsRead(id: string): void {
    this.http.patch<void>(`${this.apiUrl}/${id}/read`, {}).subscribe(() => {
      this.notificationsSubject.next(
        this.notificationsSubject.value.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    });
  }

  markAllAsRead(): void {
    this.http.patch<void>(`${this.apiUrl}/read-all`, {}).subscribe(() => {
      this.notificationsSubject.next(
        this.notificationsSubject.value.map(n => ({ ...n, isRead: true }))
      );
    });
  }

  deleteNotification(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe(() => {
      this.notificationsSubject.next(
        this.notificationsSubject.value.filter(n => n.id !== id)
      );
    });
  }

  ngOnDestroy(): void {
    this.stompClient?.deactivate();
  }
}
