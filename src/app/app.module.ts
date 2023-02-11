import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ActualItemModule } from './feature/actual-item/actual-item.module';
import { BudgetItemModule } from './feature/budget-item/budget-item.module';
import { BudgetVarianceModule } from './feature/budget-variance/budget-variance.module';
import { CreateBudgetYearModule } from './feature/budget-year/create-budget-year/create-budget-year.module';
import { DeleteBudgetYearModule } from './feature/budget-year/delete-budget-year/delete-budget-year.module';
import { CreateBudgetModule } from './feature/budget/create-budget/create-budget.module';
import { CategoryModule } from './feature/category/category.module';
import { TripModule } from './feature/trip/trip.module';
import { UnitModule } from './feature/unit/unit.module';
import { CreateVersionModule } from './feature/version/create-version/create-version.module';
import { ModifyVersionModule } from './feature/version/modify-version/modify-version.module';
import { MessageBoxModule } from './shared/components/message-box/message-box.module';
import { LoadingInterceptor } from './shared/http-interceptors/loading-interceptor';
import { TitleStrategy } from '@angular/router';
import { PageTitleStrategy } from './shared/services/page-title-strategy.service';

import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
registerLocaleData(localeSv);

import { AppComponent } from './app.component';

/** @test Only for testing, should be removed if using a real backend. */
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { fakeBackendProvider } from './mock-backend/fake-backend';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    CoreModule,
    CategoryModule,
    UnitModule,
    TripModule,
    CreateBudgetYearModule,
    DeleteBudgetYearModule,
    CreateVersionModule,
    ModifyVersionModule,
    BudgetItemModule,
    ActualItemModule,
    BudgetVarianceModule,
    MessageBoxModule,
    CreateBudgetModule,
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
    /** @test Only for testing, should be removed if using a real backend. */
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
