import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: false
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser$: Observable<User | null>;
  profilePic: string;
  saveSuccess = false;
  saveError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    // Assign after authService is initialized
    this.currentUser$ = this.authService.currentUser$;

    const user = this.authService.getCurrentUser();
    this.profilePic = user?.avatarUrl
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`;

    this.profileForm = this.fb.group({
      name:  [user?.name  || '', Validators.required],
      email: [{ value: user?.email || '', disabled: true }],
      phone: [user?.phone || ''],
      bio:   ['']
    });
  }

  ngOnInit(): void {}

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const payload = {
      name:  this.profileForm.value.name,
      phone: this.profileForm.value.phone
    };

    this.http.put('http://localhost:8080/api/profile', payload).subscribe({
      next: (updatedUser: any) => {
        this.authService.updateCurrentUser({ name: updatedUser.name, phone: updatedUser.phone });
        this.saveSuccess = true;
        this.saveError = false;
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: () => {
        this.saveError = true;
        this.saveSuccess = false;
        setTimeout(() => this.saveError = false, 3000);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.profilePic = e.target.result; };
      reader.readAsDataURL(file);
    }
  }
}
