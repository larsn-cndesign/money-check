import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { checkField, findEl, setFieldValue } from 'src/app/mock-backend/element.spec-helper';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import { BUDGET_STATE_VALID, OmitAllFromStore, UNITS, UNIT_1 } from 'src/app/mock-backend/spec-constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { Unit } from './shared/unit.model';
import { UnitService } from './shared/unit.service';
import { UnitComponent } from './unit.component';

type OmitFromStore = 'items$' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const unitService: Omit<UnitService, OmitFromStore> = {
  loadUnitPage(budgetId: number): Observable<Unit[]> {
    return of(UNITS);
  },
  modifyUnit(categoryItem: Unit, action: string): Observable<Unit> {
    return of(UNIT_1);
  },
  duplicate(value: string, action: string): boolean {
    return false;
  },
  // StoreItem
  get items(): Unit[] {
    return UNITS;
  },
  clearSelection(): void {},
  selectItem(item: Unit): void {
    item.selected = true;
  },
};

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetState' | 'setBudgetSate' | 'changeBudget';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetStateInStore(): Observable<BudgetState> {
    return of(BUDGET_STATE_VALID);
  },
};

describe('UnitComponent', () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;
  let units: Unit[];

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
        MatCheckboxModule,
      ],
      declarations: [UnitComponent],
      providers: [
        { provide: BudgetStateService, useValue: budgetStateService },
        { provide: UnitService, useValue: unitService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitComponent);
    component = fixture.componentInstance;
    units = deepCoyp(UNITS) as Unit[];
    component.units$ = of(units);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
    fixture.detectChanges();

    const spy = spyOn(unitService, 'clearSelection');

    const element = findEl(fixture, 'action');
    element.triggerEventHandler('change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not clear selection or resets the form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(unitService, 'clearSelection');

    const element = findEl(fixture, 'action');
    element.triggerEventHandler('change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const category = deepCoyp(units[0]) as Unit;
    fixture.detectChanges();

    component.units$.subscribe((item) => {
      category.selected = item[0].selected;
    });

    unitService.selectItem(category);

    const element = findEl(fixture, 'select-item');
    element.triggerEventHandler('click', { item: category });
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(selectedItems.length).toBe(1);
    expect(category.selected).toBeTrue();
  });

  it('submits the form successfully', () => {
    const unit = { id: -1, budgetId: -1, unitName: 'Unit 4', useCurrency: false } as Unit;

    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    setFieldValue(fixture, 'unit', unit.unitName);
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyCategorySpy = spyOn(unitService, 'modifyUnit').and.returnValue(of(unit));

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(component.form.value.unitName).toBeNull(); // Form has been reset
    expect(modifyCategorySpy).toHaveBeenCalledWith(unit, Modify.Add);
  });

  it('toggles the state of a unit should use currency calculation or not', () => {
    fixture.detectChanges();

    let element = findEl(fixture, 'use-currency');
    element.triggerEventHandler('change', { checked: true });
    fixture.detectChanges();

    expect(component.form.value.useCurrency).toBeTrue();

    element = findEl(fixture, 'use-currency');
    element.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(component.form.value.useCurrency).toBeFalse();
  });
});
