import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Signal, signal } from '@angular/core';
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
import { click, findEl, setFieldValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { BUDGET_STATE, OmitAllFromStore, UNITS, UNIT_1 } from 'src/app/mock-backend/spec-constants';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { Unit } from './shared/unit.model';
import { UnitService } from './shared/unit.service';
import { UnitComponent } from './unit.component';

type OmitFromStore = 'items' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const unitService: Omit<UnitService, OmitFromStore> = {
  getUnits(budgetId: number): Observable<Unit[]> {
    return of(UNITS);
  },
  modifyUnit(_unitItem: Unit, _action: string): Observable<Unit> {
    return of(UNIT_1);
  },
  duplicate(_value: string, _action: string): boolean {
    return false;
  },
  // StoreItems
  clearSelection(): void {},
  getItem(_item: Unit): void {},
  getItems(skipSelected: boolean): Unit[] {
    return UNITS;
  },
};

describe('UnitComponent', () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;
  let messageBoxService: MessageBoxService;
  let dialogService: ConfirmDialogService;
  let budgetStateService: BudgetStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatRadioModule,
        MatCheckboxModule,
        ConfirmDialogComponent,
        UnitComponent,
      ],
      providers: [
        { provide: UnitService, useValue: unitService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    budgetStateService = TestBed.inject(BudgetStateService);
    budgetStateService.setBudgetSate(BUDGET_STATE);

    fixture = TestBed.createComponent(UnitComponent);
    messageBoxService = TestBed.inject(MessageBoxService);
    dialogService = TestBed.inject(ConfirmDialogService);
    component = fixture.componentInstance;

    component.units = signal([...UNITS]);

    fixture.detectChanges();
  });

  it('creates the component and loads the page', () => {
    expect(component).toBeTruthy();
    expect(component.pageLoaded()).toBeTrue();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
    const spy = spyOn(unitService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not clear selection or resets the form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(unitService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const spy = spyOn(unitService, 'getItem').and.callFake((item) => {
      item.selected = true;
    });

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(spy).toHaveBeenCalled();
    expect(selectedItems.length).toBe(1);
  });

  it('submits the form successfully', () => {
    const unit = { id: -1, budgetId: 1, unitName: 'Unit 4', useCurrency: false } as Unit;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    setFieldValue(fixture, 'unit', unit.unitName);
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyUnitSpy = spyOn(unitService, 'modifyUnit').and.returnValue(of(unit));

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(component.form.value.unitName).toBeNull(); // Form has been reset
    expect(modifyUnitSpy).toHaveBeenCalledWith(unit, Modify.Add);
  });

  it('toggles the state of a unit should use currency calculation or not', () => {
    let element = findEl(fixture, 'use-currency');
    element.triggerEventHandler('change', { checked: true });
    fixture.detectChanges();

    expect(component.form.value.useCurrency).toBeTrue();

    element = findEl(fixture, 'use-currency');
    element.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(component.form.value.useCurrency).toBeFalse();
  });

  it('deletes a unit item', () => {
    const unit = deepCoyp(UNIT_1) as Unit;

    const spyDialog = spyOn(dialogService, 'confirmed').and.returnValue(of(true));
    const spyState = spyOn(BudgetState, 'getSelectedBudgetId').and.returnValue(unit.budgetId);
    const spyMessage = spyOn(messageBoxService, 'show').and.returnValue();

    click(fixture, 'delete');

    expect(spyDialog).toHaveBeenCalled();
    expect(spyState).toHaveBeenCalled();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('sets a unit name that already exist, when adding an item', () => {
    const spy = spyOn(unitService, 'duplicate').and.returnValue(true);

    setFieldValue(fixture, 'unit', 'Unit 1');
    fixture.detectChanges();

    const element = findEl(fixture, 'unit-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(element.innerText).toContain('finns redan');
  });

  it('sets a unit name that already exist, when editing an item', () => {
    spyOn(unitService, 'duplicate').and.returnValue(false);

    setFieldValue(fixture, 'unit', 'Unit 1');
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);
  });
});
