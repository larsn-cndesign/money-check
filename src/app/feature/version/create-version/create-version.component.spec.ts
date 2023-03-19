import { registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import localeSv from '@angular/common/locales/sv';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { setMatSelectValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import {
  BUDGET_STATE,
  BUDGET_YEAR_1,
  CURRENCIES,
  MANAGE_BUDGET_YEAR,
  OmitAllFromStore,
} from 'src/app/mock-backend/spec-constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { CurrencyFormComponent } from 'src/app/shared/components/currency-form/currency-form.component';
import { CurrencyTableComponent } from 'src/app/shared/components/currency-table/currency-table.component';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { BudgetYear, Currency, ManageBudgetYear } from '../../budget-year/shared/budget-year.model';
import { BudgetVersionService } from '../shared/budget-version.service';
import { CreateVersionComponent } from './create-version.component';
registerLocaleData(localeSv);

type OmitFromStore =
  | 'item$'
  | 'items$'
  | 'item'
  | 'items'
  | 'getUnselectedItems'
  | 'addItem'
  | 'editItem'
  | 'deleteItem'
  | 'updateStore'
  | 'updateStoreItems'
  | 'selectItem'
  | 'clearSelection';

const versionService: Omit<BudgetVersionService, OmitFromStore> = {
  getBudgetYear(budgetId: number): Observable<ManageBudgetYear> {
    return of(MANAGE_BUDGET_YEAR);
  },
  getCurrentVersion(budgetYearId: number): Observable<ManageBudgetYear> {
    return of(MANAGE_BUDGET_YEAR);
  },
  addVersion(budgetYear: ManageBudgetYear): Observable<boolean>{
    return of(true);
  },
  deleteVersion(): Observable<boolean> {
    return of(true);
  },
  updateVersion(versionName: string): Observable<boolean> {
    return of(true);
  },
  duplicate(value: string): boolean {
    return false;
  },
  changeCopyBudget(copyVersion: boolean): void {},
  getBudgetYearItem(budgetYearId: number): BudgetYear | undefined {
    return BUDGET_YEAR_1;
  },
};

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetState' | 'setBudgetSate' | 'changeBudget';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetStateInStore(): Observable<BudgetState> {
    return of(BUDGET_STATE);
  },
};

describe('CreateVersionComponent', () => {
  let component: CreateVersionComponent;
  let fixture: ComponentFixture<CreateVersionComponent>;
  let manageBudgetYear: ManageBudgetYear;
  let currencies: Currency[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
      ],
      declarations: [CreateVersionComponent, CurrencyTableComponent, CurrencyFormComponent],
      providers: [
        { provide: BudgetStateService, useValue: budgetStateService },
        { provide: BudgetVersionService, useValue: versionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateVersionComponent);
    component = fixture.componentInstance;

    manageBudgetYear = deepCoyp(MANAGE_BUDGET_YEAR) as ManageBudgetYear;
    component.budgetYear$ = of(manageBudgetYear);

    currencies = deepCoyp(CURRENCIES) as Currency[];
    component.currencies$ = of(currencies);
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('sets page loaded and version id if the page was loaded successfully', () => {
    fixture.detectChanges();
    expect(component.form.value.copy).toBeFalse();
    expect(component.pageLoaded$.value).toBeTrue();
  });

  it('toggles if the previous version should be copied or not when creating a new version', async () => {
    const selectOptionIndex = 0;
    const budgetYearId = 1;
    fixture.detectChanges();

    const spyYear = spyOn(versionService, 'getBudgetYearItem').and.returnValue(BUDGET_YEAR_1);
    const spyVersion = spyOn(versionService, 'getCurrentVersion').and.returnValue(of(MANAGE_BUDGET_YEAR));

    await setMatSelectValue(fixture, 'budget-year', selectOptionIndex);
    fixture.detectChanges();

    triggerEvent(fixture, 'copy', 'change', { checked: false });
    fixture.detectChanges();

    expect(component.form.value.copy).toBeFalse();

    triggerEvent(fixture, 'copy', 'change', { checked: true });
    fixture.detectChanges();

    expect(spyYear).toHaveBeenCalledWith(budgetYearId);
    // expect(spyVersion).toHaveBeenCalledWith(BUDGET_YEAR_1); // TODO
    expect(component.form.value.copy).toBeTrue();
  });
});
