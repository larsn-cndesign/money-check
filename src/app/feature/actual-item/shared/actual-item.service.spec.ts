import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import {
  ACTUAL_ITEM_1,
  ACTUAL_ITEM_2,
  BUDGET_YEARS,
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
   * @param url The expected url without '/api/'
   * @param yearId The id of the year. -1: all years, 1:2022, 2:2023
   * @param action Type of action Add/Edit/Delete
   * @param itemCount The expected number of actual items
   */
  function modifyItem(url: string, yearId: number, action: string, itemCount: number): void {
    let actualItem: ActualItem | undefined;
    const expectedUrl = '/api/' + url;
    actualItemService.item.filter = FILTER;
    actualItemService.item.filter.budgetYearId = yearId;
    actualItemService.item.budgetYears = BUDGET_YEARS;
    actualItemService.items.push(ACTUAL_ITEM_1);

    actualItemService
      .modifyActualItem(ACTUAL_ITEM_1, action)
      .pipe(first())
      .subscribe((item) => {
        actualItem = item;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(ACTUAL_ITEM_1);
    httpMock.verify();

    expect(req.request.method).toBe('POST');
    expect(actualItem).toEqual(ACTUAL_ITEM_1);
    expect(actualItemService.items.length).toBe(itemCount);
  }

  /**
   * Helper function to sort data based on column and direction.
   * @param active The id (name) of the column beeing sorted
   * @param ascending The sorting direction, asc|desc
   */
  function sortActualItems(active: string, direction: string): void {
    actualItemService.items.splice(0, actualItemService.items.length);
    actualItemService.items.push(ACTUAL_ITEM_1);
    actualItemService.items.push(ACTUAL_ITEM_2);

    const sort = { active, direction } as Sort;

    actualItemService.sortData(sort);

    expect(actualItemService.items[0].id).toBe(direction === 'asc' ? 1 : 2);
    expect(actualItemService.items[1].id).toBe(direction === 'asc' ? 2 : 1);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule],
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
    const expectedUrl = '/api/GetActualItems';
    actualItemService.item.filter = FILTER;

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
    const expectedUrl = '/api/GetActualItems';
    actualItemService.item.filter = FILTER;

    const spy = spyOn(errorService, 'handleHttpError').and.callThrough();

    actualItemService
      .getActualItems(budgetId)
      .pipe(first())
      .subscribe(
        () => fail('next handler must not be called'),
        (error) => (actualError = error),
        () => fail('complete handler must not be called')
      );

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
    modifyItem('AddActualItem', -1, Modify.Add, 2);
  });

  it('adds an actual expense item (with filter)', () => {
    modifyItem('AddActualItem', 2, Modify.Add, 2);
  });

  it('does NOT add an actual expense item (year not in filter)', () => {
    modifyItem('AddActualItem', 1, Modify.Add, 1);
  });

  it('edit an actual expense item (with filter)', () => {
    modifyItem('EditActualItem', 2, Modify.Edit, 1);
  });

  it('edit an actual expense item but delete it from store as it is not in current filter year', () => {
    modifyItem('EditActualItem', 1, Modify.Edit, 0);
  });

  it('delet an actual expense item (with filter)', () => {
    modifyItem('DeleteActualItem', 2, Modify.Delete, 0);
  });

  it('validates that a year exists in a budget or not', () => {
    actualItemService.item.budgetYears = BUDGET_YEARS; // 2022, 2023.

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
    actualItemService.setFilterItem('USD', 'currency');
    actualItemService.setFilterItem('Test note', 'note');

    const filter = ItemFilter.getFilter();

    expect(filter.budgetYearId).toBe(2);
    expect(filter.categoryId).toBe(3);
    expect(filter.tripId).toBe(4);
    expect(filter.currency).toBe('USD');
    expect(filter.note).toBe('Test note');
  });

  it('sorts actual items based on column and direction', () => {
    sortActualItems('amount', 'asc');
    sortActualItems('amount', 'desc');
    sortActualItems('currency', 'asc');
    sortActualItems('currency', 'desc');
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
    actualItemService.items.push(ACTUAL_ITEM_2);
    actualItemService.items.push(ACTUAL_ITEM_1);

    actualItemService.sortData();

    expect(actualItemService.items[0].id).toBe(1);
    expect(actualItemService.items[1].id).toBe(2);
  });
});
