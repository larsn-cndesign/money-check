import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import localeSv from '@angular/common/locales/sv';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { click, findEl, setFieldValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { selectMatOption } from 'src/app/mock-backend/material.spec-helper';
import { ACTUAL_ITEM_1, ACTUAL_ITEMS, BUDGET_STATE, MANAGE_ACTUAL_ITEM } from 'src/app/mock-backend/spec-constants';
import { toDate } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { ActualItemComponent } from './actual-item.component';
import { ActualItemService } from './shared/actual-item.service';

registerLocaleData(localeSv);

describe('ActualItemComponent', () => {
  let component: ActualItemComponent;
  let fixture: ComponentFixture<ActualItemComponent>;
  let messageBoxService: MessageBoxService;
  let dialogService: ConfirmDialogService;
  let loader: HarnessLoader;
  let budgetStateService: BudgetStateService;
  let actualItemService: ActualItemService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatDatepickerModule,
        MatRadioModule,
        MatDialogModule,
        MatNativeDateModule,
        MatSelectModule,
        ActualItemComponent,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    budgetStateService = TestBed.inject(BudgetStateService);
    budgetStateService.setBudgetSate(BUDGET_STATE);

    actualItemService = TestBed.inject(ActualItemService);
    actualItemService.setItem(MANAGE_ACTUAL_ITEM);
    actualItemService.setItems([...ACTUAL_ITEMS]);

    fixture = TestBed.createComponent(ActualItemComponent);
    messageBoxService = TestBed.inject(MessageBoxService);
    dialogService = TestBed.inject(ConfirmDialogService);
    component = fixture.componentInstance;

    component.pageLoaded.set(true);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('creates the component and loads the page', () => {
    expect(component).toBeTruthy();
    expect(component.pageLoaded()).toBeTrue();
  });

  it('clears selection and reset form when selecting to add an item', () => {
    const spy = spyOn(actualItemService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.value.action).toBe(Modify.Add);
    expect(component.form.value.id).toBe(-1);
    expect(component.form.value.category).toBe(-1);
    expect(component.form.value.trip).toBe(-1);
    expect(component.form.value.purchaseDate).not.toBeNull();
    expect(component.form.value.currencyCode).toBeNull();
    expect(component.form.value.amount).toBeNull();
    expect(component.form.value.note).toBe('');
  });

  it('does NOT clear selection or reset form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const spy = spyOn(actualItemService, 'selectItem').and.callFake((item) => {
      item.selected = true;
    });

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(spy).toHaveBeenCalled();
    expect(selectedItems.length).toBe(1);
  });

  it('selects an item when the note field is more than one line of text', () => {
    const actualItems = [...ACTUAL_ITEMS];
    actualItems[0].note = 'Row one\nRow two';
    fixture.detectChanges();

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    expect(component.noteFieldRows).toBe(4);
  });

  it('selects an item when the note field is only one line of text', () => {
    const actualItems = [...ACTUAL_ITEMS];
    actualItems[0].note = 'Only one row';
    fixture.detectChanges();

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    expect(component.noteFieldRows).toBe(1);
  });

  it('submits the form successfully', async () => {
    // Act
    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    await selectMatOption(loader, 'category', 0);
    await selectMatOption(loader, 'currencyCode', 1);
    setFieldValue(fixture, 'purchaseDate', '2023-02-01');
    setFieldValue(fixture, 'amount', '123');
    setFieldValue(fixture, 'note', 'This is my note');
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyItemSpy = spyOn<any>(component, 'modifyItem');

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    // Assert
    expect(component.form.value.category).toBe(1);
    expect(component.form.value.currencyCode).toBe('EUR');
    expect(component.form.value.purchaseDate).withContext('2023-02-01');
    // Ensure that 'amount' is treated as a number, even if it's null or undefined
    const amount = component.form.value.amount;
    expect(amount !== null && amount !== undefined && Number(amount) === 123).toBeTrue();
    expect(component.form.value.note).toBe('This is my note');
    expect(modifyItemSpy).toHaveBeenCalled();
  });

  it('shows a save message on succsesfull submit (without writing a note)', async () => {
    await selectMatOption(loader, 'category', 0);
    await selectMatOption(loader, 'currencyCode', 1);
    setFieldValue(fixture, 'purchaseDate', '2023-02-01');
    setFieldValue(fixture, 'amount', '123');

    const spyActual = spyOn(actualItemService, 'modifyActualItem').and.returnValue(of(ACTUAL_ITEM_1));
    const spyMessage = spyOn(messageBoxService, 'show').and.returnValue();

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(spyActual).toHaveBeenCalled();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('filter actual items based on selects', () => {
    triggerEvent(fixture, 'show-filter', 'click');
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'setFilterItem');

    triggerEvent(fixture, 'filter-year', 'selectionChange', { value: 4 });
    expect(spy).toHaveBeenCalledWith(4, 'budgetYearId');

    triggerEvent(fixture, 'filter-category', 'selectionChange', { value: 3 });
    expect(spy).toHaveBeenCalledWith(3, 'category');

    triggerEvent(fixture, 'filter-trip', 'selectionChange', { value: 1 });
    expect(spy).toHaveBeenCalledWith(1, 'trip');

    triggerEvent(fixture, 'filter-currency-code', 'selectionChange', { value: 'SEK' });
    expect(spy).toHaveBeenCalledWith('SEK', 'currencyCode');
  });

  it('sorts amount in ascending order', () => {
    const sort = { active: 'amount', direction: 'asc' } as Sort;

    const spy = spyOn(actualItemService, 'sortData');

    triggerEvent(fixture, 'sort', 'matSortChange', { active: 'amount', direction: 'asc' });
    expect(spy).toHaveBeenCalledWith(sort);
  });

  it('changes the date to a valid date', () => {
    triggerEvent(fixture, 'purchaseDate', 'dateChange', { value: '2023-02-01' });
    expect(toDate(component.purchaseDate?.value)).toBe('2023-02-01');
  });

  it('changes the date to an invalid date', () => {
    triggerEvent(fixture, 'purchaseDate', 'dateChange', { value: null });
    expect(component.purchaseDate?.errors).toEqual({ invalidDate: true });
  });

  it('deletes an actual item', () => {
    const spyDialog = spyOn(dialogService, 'confirmed').and.returnValue(of(true));

    click(fixture, 'delete');

    expect(spyDialog).toHaveBeenCalled();
  });

  it('sets a purchase date for a non exising budget year', () => {
    const spy = spyOn(actualItemService, 'budgetYearNotExist').and.returnValue(true);

    setFieldValue(fixture, 'purchaseDate', '2024-02-01');
    fixture.detectChanges();

    const element = findEl(fixture, 'date-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(element.innerText).toContain('Budget saknas för detta år');
  });

  it('sets an invalid amount', () => {
    setFieldValue(fixture, 'amount', '123,,52');
    fixture.detectChanges();

    const element = findEl(fixture, 'amount-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(element.innerText).toContain('Ogiltigt nummer');
  });

  it('sets the number of rows to display in the note form field based on focus and blur events', () => {
    triggerEvent(fixture, 'note', 'focused');
    expect(component.noteFieldRows).toBe(4);

    triggerEvent(fixture, 'note', 'unfocused');
    expect(component.noteFieldRows).toBe(1);
  });

  it('calculates the amount based on the selected currency', () => {
    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'SEK' });
    expect(component.sumCurrency).toBe(600); // 100 + (50 * 10)

    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'EUR' });
    expect(component.sumCurrency).toBe(60); // 50 + (100 / 10)

    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'AUD' });
    expect(component.sumCurrency).toBe(150); // 50 + 100
  });
});
