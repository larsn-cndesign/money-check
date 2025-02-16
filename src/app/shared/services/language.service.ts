import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  localeChanged = new EventEmitter<string>();

  constructor(private translate: TranslateService) {}

  getLanguage(): string {
    const language = localStorage.getItem('languange');
    if (!language) localStorage.setItem('languange', 'en-GB');

    return localStorage.getItem('languange') ?? 'en-GB';
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.setDateLocale(language);
    localStorage.setItem('languange', language);
  }

  // Set the date locale based on the current language
  setDateLocale(language: string): void {
    this.localeChanged.emit(language);
  }
}
