import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: false
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  isSaving = false;
  isLoading = true;
  saveSuccess = false;
  saveError = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {
    this.settingsForm = this.fb.group({
      language:          ['pt-BR'],
      currency:          ['BRL'],
      pushNotifications: [true],
      emailSummary:      [false],
      twoFactorAuth:     [false]
    });
  }

  ngOnInit(): void {
    // Immediately patch from localStorage cache so the form shows instantly (no flicker)
    this.settingsForm.patchValue(this.settingsService.current);
    this.isLoading = false;
    this.settingsForm.markAsPristine();
    this.cdr.detectChanges();

    // Then refresh from API in background
    this.settingsService.getSettings().subscribe({
      next: settings => {
        this.settingsForm.patchValue(settings);
        this.settingsService.applySettings(settings); // keep localStorage in sync
        this.settingsForm.markAsPristine();
        this.cdr.detectChanges();
      },
      error: () => {
        // API offline — we already have defaults from localStorage, nothing to do
      }
    });
  }

  get isDirty(): boolean { return this.settingsForm.dirty; }

  saveSettings(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    this.saveSuccess = false;
    this.saveError = false;
    this.cdr.detectChanges();

    this.settingsService.updateSettings(this.settingsForm.value).subscribe({
      next: saved => {
        this.settingsService.applySettings(saved); // broadcast + localStorage
        this.isSaving = false;
        this.saveSuccess = true;
        this.settingsForm.markAsPristine();
        this.cdr.detectChanges();
        setTimeout(() => { this.saveSuccess = false; this.cdr.detectChanges(); }, 4000);
      },
      error: () => {
        this.isSaving = false;
        this.saveError = true;
        this.cdr.detectChanges();
        setTimeout(() => { this.saveError = false; this.cdr.detectChanges(); }, 4000);
      }
    });
  }
}
