import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../services/auth.service';
import { WorkspaceService, WorkspaceResponse } from '../../services/workspace.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: false
})
export class SidebarComponent {
  currentUser$: Observable<User | null>;
  workspaces$: Observable<WorkspaceResponse[]>;
  currentWorkspace$: Observable<WorkspaceResponse | null>;
  showCreateModal$: Observable<boolean>;
  newWorkspaceName = '';
  isCreating = false;

  constructor(
    private authService: AuthService,
    private workspaceService: WorkspaceService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.workspaces$ = this.workspaceService.workspaces$;
    this.currentWorkspace$ = this.workspaceService.currentWorkspace$;
    this.showCreateModal$ = this.workspaceService.showCreateModal$;
  }

  switchWorkspace(workspace: WorkspaceResponse): void {
    this.workspaceService.switchWorkspace(workspace);
  }

  openCreateModal(): void {
    this.workspaceService.openCreateModal();
    this.newWorkspaceName = '';
  }

  closeCreateModal(): void {
    this.workspaceService.closeCreateModal();
    this.newWorkspaceName = '';
  }

  onCreateWorkspace(): void {
    if (!this.newWorkspaceName.trim() || this.isCreating) return;

    this.isCreating = true;
    this.workspaceService.createWorkspace(this.newWorkspaceName).subscribe({
      next: () => {
        this.isCreating = false;
        this.closeCreateModal();
      },
      error: () => {
        this.isCreating = false;
      }
    });
  }

  removeWorkspace(event: Event, workspace: WorkspaceResponse): void {
    event.stopPropagation(); // Evitar trocar de workspace ao clicar no lixo
    
    if (confirm(`Tem certeza que deseja excluir o workspace "${workspace.name}"?`)) {
      this.workspaceService.deleteWorkspace(workspace.id).subscribe({
        error: (err) => {
          alert(err.error?.message || "Erro ao excluir workspace.");
        }
      });
    }
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';
  }
}
