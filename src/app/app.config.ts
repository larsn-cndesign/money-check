import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeSv from '@angular/common/locales/sv';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { LoadingInterceptor } from './shared/http-interceptors/loading-interceptor';
import { LanguageService } from './shared/services/language.service';
import { CustomDateAdapter } from './shared/services/custom-date-adapter.service';
import { fakeBackendProvider } from './mock-backend/fake-backend'; // @Test Only for testing, should be removed if using a real backend.

registerLocaleData(localeSv);
registerLocaleData(localeEs);
registerLocaleData(localeEn); // Fallback to en-GB

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, '/assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: [environment.allowedDomains],
          disallowedRoutes: [environment.disallowedRoutes],
        },
      })
    ),
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (languageService: LanguageService) => languageService.setDateLocale(languageService.getLanguage()),
      deps: [LanguageService],
    },
    {
      provide: LOCALE_ID,
      useFactory: (languageService: LanguageService) => languageService.getLanguage(),
      deps: [LanguageService],
    },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', floatLabel: 'always' } },
    { provide: APP_BASE_HREF, useValue: '/' },
    fakeBackendProvider, // @Test Only for testing, should be removed if using a real backend.
  ],
};
