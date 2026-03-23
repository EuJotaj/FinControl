import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface WorkspaceResponse {
  id: string;
  name: string;
  planName: string;
  userRole: string;
  joinedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:8080/api/workspaces';
  
  private workspacesSubject = new BehaviorSubject<WorkspaceResponse[]>([]);
  private currentWorkspaceSubject = new BehaviorSubject<WorkspaceResponse | null>(null);
  private showCreateModalSubject = new BehaviorSubject<boolean>(false);

  public workspaces$ = this.workspacesSubject.asObservable();
  public currentWorkspace$ = this.currentWorkspaceSubject.asObservable();
  public showCreateModal$ = this.showCreateModalSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Load workspaces when service initializes
    if (this.authService.isAuthenticated()) {
      this.loadWorkspaces().subscribe();
    }
  }

  openCreateModal(): void {
    this.showCreateModalSubject.next(true);
  }

  closeCreateModal(): void {
    this.showCreateModalSubject.next(false);
  }

  loadWorkspaces(): Observable<WorkspaceResponse[]> {
    return this.http.get<WorkspaceResponse[]>(this.apiUrl).pipe(
      tap(workspaces => {
        this.workspacesSubject.next(workspaces);
        
        // Se já tivermos um tenant ativo, tentamos selecioná-lo na lista
        const activeTenantId = this.authService.getTenantId();
        if (activeTenantId && workspaces.length > 0) {
          const workspace = workspaces.find(w => w.id === activeTenantId);
          if (workspace) {
            this.currentWorkspaceSubject.next(workspace);
          } else {
             // Caso o workspace salvo não exista mais para esse usuário, pega o primeiro
             this.switchWorkspace(workspaces[0]);
          }
        } else if (workspaces.length > 0) {
          this.switchWorkspace(workspaces[0]);
        }
      })
    );
  }

  switchWorkspace(workspace: WorkspaceResponse): void {
    this.authService.setTenantId(workspace.id);
    this.currentWorkspaceSubject.next(workspace);
    // Reload the application to refresh all data with the new Tenant ID
    window.location.reload();
  }

  createWorkspace(name: string): Observable<WorkspaceResponse> {
    return this.http.post<WorkspaceResponse>(this.apiUrl, { name }).pipe(
      tap(newWorkspace => {
        const currentWorkspaces = this.workspacesSubject.value;
        this.workspacesSubject.next([...currentWorkspaces, newWorkspace]);
      })
    );
  }

  deleteWorkspace(workspaceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${workspaceId}`).pipe(
      tap(() => {
        // Se deletamos o workspace atual, precisamos trocar para outro e dar reload
        const activeTenantId = this.authService.getTenantId();
        if (activeTenantId === workspaceId) {
          localStorage.removeItem('tenant_id');
        }
        
        // Recarregar workspaces
        this.loadWorkspaces().subscribe({
          next: (workspaces) => {
            if (activeTenantId === workspaceId) {
              window.location.reload();
            }
          }
        });
      })
    );
  }
}
