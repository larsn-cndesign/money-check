import { registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { Observable, of } from 'rxjs';
import {
  click,
  findEl,
  setFieldValue,
  setMatSelectValue,
  triggerEvent,
} from 'src/app/mock-backend/element.spec-helper';
import { deepCoyp, toDate } from 'src/app/shared/classes/common.fn';
import {
  ACTUAL_ITEMS,
  ACTUAL_ITEM_1,
  BUDGET_STATE_VALID,
  MANAGE_ACTUAL_ITEM,
  OmitAllFromStore,
} from 'src/app/mock-backend/spec-constants';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { TitleService } from 'src/app/shared/services/title.service';
import { BudgetState } from '../../shared/classes/budget-state.model';
import { ActualItemComponent } from './actual-item.component';
import { ActualItem, ManageActualItem } from './shared/actual-item.model';
import { ActualItemService } from './shared/actual-item.service';
registerLocaleData(localeSv);

type OmitFromStore =
  | 'item$'
  | 'items$'
  | 'getUnselectedItems'
  | 'addItem'
  | 'editItem'
  | 'deleteItem'
  | 'updateStore'
  | 'updateStoreItems';

const actualItemService: Omit<ActualItemService, OmitFromStore> = {
  getActualItems(): Observable<ManageActualItem> {
    return of(MANAGE_ACTUAL_ITEM);
  },
  budgetYearNotExist(): boolean {
    return false;
  },
  modifyActualItem(): Observable<ActualItem> {
    return of(ACTUAL_ITEM_1);
  },
  sortData(_sort: Sort): void {},
  setFilterItem(_value: any, _filterType: string): void {},
  // StoreItem
  get item(): ManageActualItem {
    return MANAGE_ACTUAL_ITEM;
  },
  get items(): ActualItem[] {
    const actualItemSEK = deepCoyp(ACTUAL_ITEM_1) as ActualItem;
    actualItemSEK.amount = 300;
    actualItemSEK.currency = 'SEK';

    const actualItemEUR = deepCoyp(ACTUAL_ITEM_1) as ActualItem;
    actualItemEUR.amount = 150;
    actualItemEUR.currency = 'EUR';

    return [actualItemSEK, actualItemEUR];
  },
  clearSelection(): void {},
  selectItem(_item: ActualItem): void {},
};

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetState' | 'setBudgetSate' | 'changeBudget';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetStateInStore(): Observable<BudgetState> {
    return of(BUDGET_STATE_VALID);
  },
};

describe('ActualItemComponent', () => {
  let component: ActualItemComponent;
  let fixture: ComponentFixture<ActualItemComponent>;
  let titleService: TitleService;
  let messageBoxService: MessageBoxService;
  let dialogService: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
      ],
      declarations: [ActualItemComponent],
      providers: [
        { provide: ActualItemService, useValue: actualItemService },
        { provide: BudgetStateService, useValue: budgetStateService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualItemComponent);
    titleService = TestBed.inject(TitleService);
    messageBoxService = TestBed.inject(MessageBoxService);
    dialogService = TestBed.inject(ConfirmDialogService);
    component = fixture.componentInstance;

    component.manageActualItem$ = of(MANAGE_ACTUAL_ITEM);
    component.actualItems$ = of(ACTUAL_ITEMS);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verifies that the document title is set', () => {
    const spy = spyOn(titleService, 'setTitle');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith('Hantera Transaktioner');
  });

  it('clears selection and reset form when selecting to add an item', () => {
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.form.value.action).toBe(Modify.Add);
    expect(component.form.value.id).toBe(-1);
    expect(component.form.value.category).toBeNull();
    expect(component.form.value.trip).toBe(-1);
    expect(component.form.value.purchaseDate).not.toBeNull();
    expect(component.form.value.currency).toBe('');
    expect(component.form.value.amount).toBeNull();
    expect(component.form.value.note).toBeNull();
  });

  it('does NOT clear selection or reset form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const actualItems = deepCoyp(ACTUAL_ITEMS) as ActualItem[];
    component.actualItems$ = of(actualItems);
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'selectItem').and.callFake(() => {
      actualItems[0].selected = true;
    });

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(spy).toHaveBeenCalled();
    expect(selectedItems.length).toBe(1);
  });

  it('selects an item when the note field is more than one line of text', () => {
    const actualItems = deepCoyp(ACTUAL_ITEMS) as ActualItem[];
    actualItems[0].note = 'Rad ett\nRad två';
    component.actualItems$ = of(actualItems);
    fixture.detectChanges();

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    expect(component.noteFieldRows).toBe(4);
  });

  it('selects an item when the note field is only one line of text', () => {
    const actualItems = deepCoyp(ACTUAL_ITEMS) as ActualItem[];
    actualItems[0].note = 'Endast en rad';
    component.actualItems$ = of(actualItems);
    fixture.detectChanges();

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    expect(component.noteFieldRows).toBe(1);
  });

  it('submits the form successfully', async () => {
    // Arrange
    const manageActualItem = deepCoyp(MANAGE_ACTUAL_ITEM) as ManageActualItem;
    manageActualItem.categories[0].id = 4;
    manageActualItem.currencies[1] = 'USD';
    component.manageActualItem$ = of(manageActualItem);
    fixture.detectChanges();

    // Act
    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    await setMatSelectValue(fixture, 'category', 0);
    await setMatSelectValue(fixture, 'currency', 1);
    setFieldValue(fixture, 'purchaseDate', '2023-02-01');
    setFieldValue(fixture, 'amount', '123');
    setFieldValue(fixture, 'note', 'This is my note');
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyItemSpy = spyOn<any>(component, 'modifyItem');

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    // Assert
    expect(component.form.value.category).toBeTruthy(4);
    expect(component.form.value.currency).toBe('USD');
    expect(component.form.value.purchaseDate).toBeTruthy('2023-02-01');
    expect(component.form.value.amount).toBeTruthy(123);
    expect(component.form.value.note).toBe('This is my note');
    expect(modifyItemSpy).toHaveBeenCalled();
  });

  it('shows a save message on succsesfull submit (without writing a note)', async () => {
    fixture.detectChanges();

    await setMatSelectValue(fixture, 'category', 0);
    await setMatSelectValue(fixture, 'currency', 1);
    setFieldValue(fixture, 'purchaseDate', '2023-02-01');
    setFieldValue(fixture, 'amount', '123');

    const spyActual = spyOn(actualItemService, 'modifyActualItem').and.returnValue(of(ACTUAL_ITEM_1));
    const spyMessage = spyOn(messageBoxService, 'show').and.returnValue();

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(spyActual).toHaveBeenCalled();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('filters actual items based on the note field', () => {
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'setFilterItem');

    triggerEvent(fixture, 'filter-note', 'input', { value: 'filter text' });
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('filter text', 'note');
  });

  it('filter actual items based on selects', () => {
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'setFilterItem');

    triggerEvent(fixture, 'filter-year', 'selectionChange', { value: 4 });
    expect(spy).toHaveBeenCalledWith(4, 'budgetYearId');

    triggerEvent(fixture, 'filter-category', 'selectionChange', { value: 3 });
    expect(spy).toHaveBeenCalledWith(3, 'category');

    triggerEvent(fixture, 'filter-trip', 'selectionChange', { value: 1 });
    expect(spy).toHaveBeenCalledWith(1, 'trip');

    triggerEvent(fixture, 'filter-currency', 'selectionChange', { value: 'SEK' });
    expect(spy).toHaveBeenCalledWith('SEK', 'currency');
  });

  it('sorts amount in ascending order', () => {
    const sort = { active: 'amount', direction: 'asc' } as Sort;
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'sortData');

    triggerEvent(fixture, 'sort', 'matSortChange', { active: 'amount', direction: 'asc' });
    expect(spy).toHaveBeenCalledWith(sort);
  });

  it('changes the date to a valid date', () => {
    fixture.detectChanges();

    triggerEvent(fixture, 'purchaseDate', 'dateChange', { value: '2023-02-01' });
    expect(toDate(component.purchaseDate?.value)).toBe('2023-02-01');
  });

  it('changes the date to an invalid date', () => {
    fixture.detectChanges();

    triggerEvent(fixture, 'purchaseDate', 'dateChange', { value: null });
    expect(component.purchaseDate?.errors).toEqual({ invalidDate: true });
  });

  it('deletes an actual item', () => {
    fixture.detectChanges();

    const spyDialog = spyOn(dialogService, 'confirmed').and.returnValue(of(true));
    const modifyActualItemSpy = spyOn(actualItemService, 'modifyActualItem').and.returnValue(of(ACTUAL_ITEM_1));

    click(fixture, 'delete');

    expect(spyDialog).toHaveBeenCalled();
    expect(modifyActualItemSpy).toHaveBeenCalledWith(ACTUAL_ITEM_1, Modify.Delete);
  });

  it('sets a purchase date for a non exising budget year', () => {
    fixture.detectChanges();

    const spy = spyOn(actualItemService, 'budgetYearNotExist').and.returnValue(true);

    setFieldValue(fixture, 'purchaseDate', '2024-02-01');
    fixture.detectChanges();

    const element = findEl(fixture, 'date-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(element.innerText).toContain('Budget saknas för detta år');
  });

  it('sets an invalid amount', () => {
    fixture.detectChanges();

    setFieldValue(fixture, 'amount', '123,,52');
    fixture.detectChanges();

    const element = findEl(fixture, 'amount-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(element.innerText).toContain('Ogiltigt nummer');
  });

  it('sets the number of rows to display in the note form field based on focus and blur events', () => {
    fixture.detectChanges();

    triggerEvent(fixture, 'note', 'focused');
    expect(component.noteFieldRows).toBe(4);

    triggerEvent(fixture, 'note', 'unfocused');
    expect(component.noteFieldRows).toBe(1);
  });

  it('calculates the amount based on the selected currency', () => {
    fixture.detectChanges();

    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'SEK' });
    expect(component.sumCurrency).toBe(1800);

    fixture.detectChanges();

    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'EUR' });
    expect(component.sumCurrency).toBe(180);

    triggerEvent(fixture, 'sum-currency', 'selectionChange', { value: 'AUD' });
    expect(component.sumCurrency).toBe(450);
  });
});
