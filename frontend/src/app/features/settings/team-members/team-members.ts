import { Component, OnInit } from '@angular/core';
import { WorkspaceService, WorkspaceResponse } from '../../../core/services/workspace.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.html',
  styleUrls: ['./team-members.scss'],
  standalone: false
})
export class TeamMembersComponent implements OnInit {
  currentWorkspace$: Observable<WorkspaceResponse | null>;

  // Mock data for UI showcase until backend TeamMembers invite API is completed
  members = [
    { id: 1, name: 'Janio', email: 'janil@example.com', role: 'OWNER', status: 'ACTIVE', initials: 'JA', color: 'bg-indigo-500' },
    { id: 2, name: 'Alice Silva', email: 'alice@example.com', role: 'ADMIN', status: 'ACTIVE', initials: 'AS', color: 'bg-emerald-500' },
    { id: 3, name: 'Lucas Costa', email: 'lucas@example.com', role: 'MEMBER', status: 'INVITED', initials: 'LC', color: 'bg-amber-500' }
  ];

  constructor(private workspaceService: WorkspaceService) {
    this.currentWorkspace$ = this.workspaceService.currentWorkspace$;
  }

  ngOnInit(): void {
  }

  inviteMember(): void {
    alert('Funcionalidade de convite será conectada à API em breve.');
  }
}
