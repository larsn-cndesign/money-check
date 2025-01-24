import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ConfirmDialogModule } from './shared/components/confirm-dialog/confirm-dialog.module';
import { MessageBoxModule } from './shared/components/message-box/message-box.module';
import { LoadingInterceptor } from './shared/http-interceptors/loading-interceptor';
import { PageTitleStrategy } from './shared/services/page-title-strategy.service';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
registerLocaleData(localeSv);

import { AppComponent } from './app.component';

/** @Test Only for testing, should be removed if using a real backend. */
import { fakeBackendProvider } from './mock-backend/fake-backend';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    SpinnerModule,
    CoreModule,
    MessageBoxModule,
    ConfirmDialogModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem(environment.tokenName);
        },
        allowedDomains: [environment.allowedDomains],
        disallowedRoutes: [environment.disallowedRoutes],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'sv-SE' },
    { provide: MAT_DATE_LOCALE, useValue: 'sv-SE' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    /** @Test Only for testing, should be removed if using a real backend. */
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
