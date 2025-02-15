import { registerLocaleData } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import localeSv from '@angular/common/locales/sv';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  localeChanged = new EventEmitter<string>();
  
  constructor(private translate: TranslateService) {}

  getLanguage(): string {
    return localStorage.getItem('languange') ?? 'en-GB';
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.setDateLocale(language);
    localStorage.setItem('languange', language);
  }

  // Set the date locale based on the current language
  setDateLocale(language: string): void {
    switch (language) {
      case 'sv-SE':
        registerLocaleData(localeSv);
        break;
      case 'es-ES':
        registerLocaleData(localeEs);
        break;
      default:
        registerLocaleData(localeEn); // Fallback to en-GB
    }

    this.localeChanged.emit(language);
  }
}
