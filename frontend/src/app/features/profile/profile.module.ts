import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

const routes: Routes = [{ path: '', component: ProfileComponent }];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule.forChild(routes),
    TranslatePipe
  ]
})
export class ProfileModule { }
