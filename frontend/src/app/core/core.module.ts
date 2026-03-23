import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@NgModule({
  declarations: [SidebarComponent, TopbarComponent, BottomNavComponent],
  imports: [CommonModule, RouterModule, TranslatePipe, FormsModule],
  exports: [SidebarComponent, TopbarComponent, BottomNavComponent, TranslatePipe],
})
export class CoreModule {}
