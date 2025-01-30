import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeSv from '@angular/common/locales/sv';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
// import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { LoadingInterceptor } from './shared/http-interceptors/loading-interceptor';
// import { LanguageService } from './shared/services/language.service';
// import { WINDOW_PROVIDERS } from './shared/services/window.service';
// import { PaginatorIntl } from './shared/utilities/paginator-intl';

registerLocaleData(localeSv);

// /** @Test Only for testing, should be removed if using a real backend. */
import { fakeBackendProvider } from './mock-backend/fake-backend';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}

// export function translateHttpLoaderFactory(httpBackend: HttpBackend): TranslateHttpLoader {
//   return new TranslateHttpLoader(new HttpClient(httpBackend));
// }

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
    // provideHttpClient(),
    // importProvidersFrom(
    //   TranslateModule.forRoot({
    //     loader: {
    //       provide: TranslateLoader,
    //       useFactory: translateHttpLoaderFactory,
    //       deps: [HttpBackend],
    //     },
    //   })
    // ),
    provideHttpClient(withInterceptorsFromDi()),
    // WINDOW_PROVIDERS,
    // {
    //   provide: LOCALE_ID,
    //   deps: [LanguageService],
    //   useFactory: (languageService: LanguageService): string => languageService.getLanguage(),
    // },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'sv-SE' },
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
    // { provide: MatPaginatorIntl, useClass: PaginatorIntl },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill', floatLabel: 'always' } },
    { provide: APP_BASE_HREF, useValue: '/' },
    //     /** @Test Only for testing, should be removed if using a real backend. */
    fakeBackendProvider,
  ],
};
