import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SettingsComponent } from './settings.component';
import { TeamMembersComponent } from './team-members/team-members';

const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'team', component: TeamMembersComponent }
];

@NgModule({
  declarations: [SettingsComponent, TeamMembersComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), CoreModule],
})
export class SettingsModule {}
