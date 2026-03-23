import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface AppSettings {
  language: string;
  currency: string;
  pushNotifications: boolean;
  emailSummary: boolean;
  twoFactorAuth: boolean;
}

const STORAGE_KEY = 'fincontrol_settings';

const DEFAULTS: AppSettings = {
  language: 'pt-BR',
  currency: 'BRL',
  pushNotifications: true,
  emailSummary: false,
  twoFactorAuth: false
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly apiUrl = 'http://localhost:8080/api/settings';

  private _settings = new BehaviorSubject<AppSettings>(this.loadFromStorage());
  readonly settings$ = this._settings.asObservable();

  constructor(private http: HttpClient) {}

  // ── Active getters ─────────────────────────────────────────────────
  get current(): AppSettings { return this._settings.value; }
  get currency(): string     { return this._settings.value.currency; }
  get language(): string     { return this._settings.value.language; }

  /** Currency label shown in UI (e.g. "R$", "US$", "€") */
  get currencySymbol(): string {
    const map: Record<string, string> = { BRL: 'R$', USD: 'US$', EUR: '€', GBP: '£' };
    return map[this.currency] ?? this.currency;
  }

  /** Language label for display */
  get languageLabel(): string {
    const map: Record<string, string> = { 'pt-BR': 'Português (Brasil)', 'en-US': 'English (USA)', 'es-ES': 'Español' };
    return map[this.language] ?? this.language;
  }

  // ── API calls ──────────────────────────────────────────────────────
  getSettings() {
    return this.http.get<AppSettings>(this.apiUrl);
  }

  updateSettings(settings: AppSettings) {
    return this.http.put<AppSettings>(this.apiUrl, settings);
  }

  /** Called after successful API save — updates reactive state + cache */
  applySettings(settings: AppSettings): void {
    this._settings.next(settings);
    this.saveToStorage(settings);
    this.applyLocale(settings.language);
  }

  // ── Locale ─────────────────────────────────────────────────────────
  private applyLocale(lang: string): void {
    document.documentElement.lang = lang.split('-')[0];
  }

  // ── Storage ────────────────────────────────────────────────────────
  private loadFromStorage(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch { return { ...DEFAULTS }; }
  }

  private saveToStorage(s: AppSettings): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }
}
