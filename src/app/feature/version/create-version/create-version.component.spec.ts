import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import localeSv from '@angular/common/locales/sv';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { selectMatOption } from 'src/app/mock-backend/material.spec-helper';
import { BUDGET_STATE, BUDGET_YEAR_1, MANAGE_BUDGET_YEAR } from 'src/app/mock-backend/spec-constants';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { BudgetVersionService } from '../shared/budget-version.service';
import { CreateVersionComponent } from './create-version.component';
registerLocaleData(localeSv);

describe('CreateVersionComponent', () => {
  let component: CreateVersionComponent;
  let fixture: ComponentFixture<CreateVersionComponent>;
  let loader: HarnessLoader;
  let budgetStateService: BudgetStateService;
  let versionService: BudgetVersionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CreateVersionComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    budgetStateService = TestBed.inject(BudgetStateService);
    budgetStateService.setBudgetSate(BUDGET_STATE);

    versionService = TestBed.inject(BudgetVersionService);
    versionService.setItem(MANAGE_BUDGET_YEAR);

    fixture = TestBed.createComponent(CreateVersionComponent);
    component = fixture.componentInstance;

    component.pageLoaded.set(true);

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('sets page loaded and version id if the page was loaded successfully', () => {
    const budgetYearId = 1;

    const spyYear = spyOn(versionService, 'getBudgetYear').and.returnValue(of(MANAGE_BUDGET_YEAR));
    fixture.detectChanges();

    expect(component.form.value.copy).toBeFalse();
    expect(component.pageLoaded()).toBeTrue();
    expect(spyYear).toHaveBeenCalledWith(budgetYearId);
  });

  it('toggles if the previous version should be copied or not when creating a new version', async () => {
    const selectOptionIndex = 0;
    const budgetYearId = 1;
    fixture.detectChanges();

    const spyYear = spyOn(versionService, 'getBudgetYearItem').and.returnValue(BUDGET_YEAR_1);

    await selectMatOption(loader, 'budget-year', selectOptionIndex);
    fixture.detectChanges();

    triggerEvent(fixture, 'copy', 'change', { checked: false });
    fixture.detectChanges();

    expect(component.form.value.copy).toBeFalse();

    triggerEvent(fixture, 'copy', 'change', { checked: true });
    fixture.detectChanges();

    expect(spyYear).toHaveBeenCalledWith(budgetYearId);
    expect(component.form.value.copy).toBeTrue();
  });
});
