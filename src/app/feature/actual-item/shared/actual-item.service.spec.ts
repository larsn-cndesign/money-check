import { CommonModule } from '@angular/common';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import {
  ACTUAL_ITEM_1,
  ACTUAL_ITEM_2,
  BUDGET_YEARS,
  deepCopyActualItem,
  FILTER,
  MANAGE_ACTUAL_ITEM,
} from 'src/app/mock-backend/spec-constants';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { Modify } from 'src/app/shared/enums/enums';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActualItem, ManageActualItem } from './actual-item.model';
import { ActualItemService } from './actual-item.service';

describe('ActualItemService', () => {
  let actualItemService: ActualItemService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  /**
   * Helper function to test actual item modifications.
   * @param yearId The id of the year. -1: all years, 1:2022, 2:2023
   * @param action Type of action Add/Edit/Delete
   * @param itemCount The expected number of actual items
   */
  function modifyItem(yearId: number, action: string, itemCount: number): void {
    let actualItem: ActualItem | undefined;
    const expectedUrl = '/api/actualItem';

    // Mock item
    const currentItem = actualItemService.getItemValue();
    const updatedItem = {
      ...currentItem,
      filter: { ...currentItem.filter, ...FILTER, budgetYearId: yearId },
      budgetYears: BUDGET_YEARS,
    };
    actualItemService.setItem(updatedItem);

    // Mock items
    const items = actualItemService.getItemValues();
    items.splice(0, items.length);
    items.push(ACTUAL_ITEM_1);
    actualItemService.setItems(items);

    actualItemService
      .modifyActualItem(ACTUAL_ITEM_1, action)
      .pipe(first())
      .subscribe((item) => {
        actualItem = item;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(ACTUAL_ITEM_1);
    httpMock.verify();

    switch (action) {
      case Modify.Add:
        expect(req.request.method).toBe('POST');
        break;
      case Modify.Edit:
        expect(req.request.method).toBe('PUT');
        break;
      case Modify.Delete:
        expect(req.request.method).toBe('DELETE');
        break;
    }

    expect(actualItem).toEqual(ACTUAL_ITEM_1);
    expect(actualItemService.getItemValues().length).toBe(itemCount);
  }

  /**
   * Helper function to sort data based on column and direction.
   * @param active The id (name) of the column beeing sorted
   * @param ascending The sorting direction, asc|desc
   */
  function sortActualItems(active: string, direction: string): void {
    setAcutalItemsArray();

    const sort = { active, direction } as Sort;

    actualItemService.sortData(sort);

    if (validColumnName(active)) {
      expect(actualItemService.getItemValues()[0].id).toBe(direction === 'asc' ? 1 : 2);
      expect(actualItemService.getItemValues()[1].id).toBe(direction === 'asc' ? 2 : 1);
    } else {
      expect(actualItemService.getItemValues()[0].id).toBe(1);
      expect(actualItemService.getItemValues()[1].id).toBe(2);
    }
  }

  function validColumnName(name: string): boolean {
    switch (name) {
      case 'purchaseDate':
      case 'categoryName':
      case 'tripName':
      case 'currencyCode':
      case 'amount':
      case 'note':
        return true;
      default:
        return false;
    }
  }

  /**
   * Make sure the acutal items array exist of exactly two items.
   */
  function setAcutalItemsArray(): void {
    const item1 = deepCopyActualItem(ACTUAL_ITEM_1);
    const item2 = deepCopyActualItem(ACTUAL_ITEM_2);

    actualItemService.setItems([]);
    actualItemService.addItem(item1);
    actualItemService.addItem(item2);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    actualItemService = TestBed.inject(ActualItemService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(actualItemService).toBeTruthy();
  });

  it('gets actual expenses after applying a filter', () => {
    let manageActualItem: ManageActualItem | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/actualItem/get';

    const currentItem = actualItemService.getItemValue();
    const updatedItem = { ...currentItem, filter: FILTER };
    actualItemService.setItem(updatedItem);

    actualItemService
      .getActualItems(budgetId)
      .pipe(first())
      .subscribe((item) => {
        manageActualItem = item;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(MANAGE_ACTUAL_ITEM);
    httpMock.verify();

    expect(req.request.method).toBe('POST');
    expect(manageActualItem).toEqual(MANAGE_ACTUAL_ITEM);
  });

  it('passes through errors when getting actual expense items', () => {
    let actualError: HttpErrorResponse | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/actualItem/get';

    const currentItem = actualItemService.getItemValue();
    const updatedItem = { ...currentItem, filter: FILTER };
    actualItemService.setItem(updatedItem);

    const spy = spyOn(errorService, 'handleHttpError').and.callThrough();

    actualItemService
      .getActualItems(budgetId)
      .pipe(first())
      .subscribe({
        next: () => fail('next handler must not be called'),
        error: (error) => (actualError = error),
        complete: () => fail('complete handler must not be called'),
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush({ error: 'Something went wrong' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();

    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.status).toBe(500);
    expect(actualError.statusText).toBe('Server Error');
    expect(spy).toHaveBeenCalled();
  });

  it('adds an actual expense item (no filter)', () => {
    modifyItem(-1, Modify.Add, 2);
  });

  it('adds an actual expense item (with filter)', () => {
    modifyItem(2, Modify.Add, 2);
  });

  it('does NOT add an actual expense item (year not in filter)', () => {
    modifyItem(1, Modify.Add, 1);
  });

  it('edit an actual expense item (with filter)', () => {
    modifyItem(2, Modify.Edit, 1);
  });

  it('edit an actual expense item but delete it from store as it is not in current filter year', () => {
    modifyItem(1, Modify.Edit, 0);
  });

  it('delet an actual expense item (with filter)', () => {
    modifyItem(2, Modify.Delete, 0);
  });

  it('validates that a year exists in a budget or not', () => {
    const currentItem = actualItemService.getItemValue();
    const updatedItem = { ...currentItem, budgetYears: BUDGET_YEARS }; // 2022, 2023.
    actualItemService.setItem(updatedItem);

    const validDate = new Date('2022-01-01');
    const invalidDate = new Date('2021-01-01');

    let notExist = actualItemService.budgetYearNotExist(validDate);
    expect(notExist).toBeFalse();

    notExist = actualItemService.budgetYearNotExist(invalidDate);
    expect(notExist).toBeTrue();
  });

  it('sets a filter and store it in localStorage', () => {
    actualItemService.setFilterItem(2, 'budgetYearId');
    actualItemService.setFilterItem(3, 'category');
    actualItemService.setFilterItem(4, 'trip');
    actualItemService.setFilterItem('USD', 'currencyCode');
    actualItemService.setFilterItem('Test note', 'note');

    const filter = ItemFilter.getFilter();

    expect(filter.budgetYearId).toBe(2);
    expect(filter.categoryId).toBe(3);
    expect(filter.tripId).toBe(4);
    expect(filter.currencyCode).toBe('USD');
    expect(filter.note).toBe('Test note');
  });

  it('sorts actual items based on column and direction', () => {
    sortActualItems('amount', 'asc');
    sortActualItems('amount', 'desc');
    sortActualItems('currencyCode', 'asc');
    sortActualItems('currencyCode', 'desc');
    sortActualItems('tripName', 'asc');
    sortActualItems('tripName', 'desc');
    sortActualItems('categoryName', 'asc');
    sortActualItems('categoryName', 'desc');
    sortActualItems('purchaseDate', 'asc');
    sortActualItems('purchaseDate', 'desc');
    sortActualItems('note', 'asc');
    sortActualItems('note', 'desc');

    sortActualItems('invalid column', 'asc');
  });

  it('defaults to sort on purchase date if no sorting was provided', () => {
    setAcutalItemsArray();

    actualItemService.sortData();

    expect(actualItemService.getItemValues()[0].id).toBe(1);
    expect(actualItemService.getItemValues()[1].id).toBe(2);
  });
});
