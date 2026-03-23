import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

import { WorkspaceService, WorkspaceResponse } from '../../services/workspace.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  standalone: false
})
export class TopbarComponent implements OnInit, OnDestroy {
  isDarkTheme$: Observable<boolean>;
  showNotifications = false;
  showWorkspaces = false;
  currentUser: User | null = null;
  notifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  
  workspaces$: Observable<WorkspaceResponse[]>;
  currentWorkspace$: Observable<WorkspaceResponse | null>;
  
  private sub?: Subscription;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.notifications$.pipe(
      map(list => list.filter(n => !n.isRead).length)
    );
    this.workspaces$ = this.workspaceService.workspaces$;
    this.currentWorkspace$ = this.workspaceService.currentWorkspace$;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showWorkspaces = false;
  }
  
  toggleWorkspaces(): void {
    this.showWorkspaces = !this.showWorkspaces;
    this.showNotifications = false;
  }

  openCreateModal(): void {
    this.workspaceService.openCreateModal();
    this.showWorkspaces = false;
  }
  
  switchWorkspace(workspace: WorkspaceResponse): void {
    this.workspaceService.switchWorkspace(workspace);
    this.showWorkspaces = false;
    // Força o reload da aplicação para limpar estados e refetch com novo header
    window.location.reload();
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      INFO: 'info',
      WARNING: 'warning',
      SUCCESS: 'check_circle',
      ALERT: 'error'
    };
    return icons[type] ?? 'notifications';
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      INFO: 'text-blue-500',
      WARNING: 'text-amber-500',
      SUCCESS: 'text-emerald-500',
      ALERT: 'text-red-500'
    };
    return colors[type] ?? 'text-slate-500';
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    return `há ${Math.floor(diffH / 24)} dias`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
