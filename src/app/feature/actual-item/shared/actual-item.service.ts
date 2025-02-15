import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { compare, toDate } from 'src/app/shared/classes/common.fn';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { ActualItem, ManageActualItem } from './actual-item.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Class representing a service for managing actual expense items.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class ActualItemService extends StoreItem<ManageActualItem, ActualItem> {
  /**
   * Creates an actual item services.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private httpService: HttpService, private translate: TranslateService) {
    super(new ManageActualItem());
  }

  /**
   * Get actual expenses after applying a filter.
   * @param budgetId The identifier of a budget.
   * @returns Observer of `ManageActualItem` class.
   */
  getActualItems(budgetId: number): Observable<ManageActualItem> {
    const filter = this.getItemValue().filter;
    filter.budgetId = budgetId;

    return this.httpService.postItemVar<ItemFilter, ManageActualItem>(filter, 'actualItem/get').pipe(
      tap((item) => {
        if (item) {
          this.setItem(item);
          this.setItems(item.actualItems);
        }
      })
    );
  }

  /**
   * Modify an enxpense item.
   * @param actualItem The expense item to be modified.
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `ActualItem` representing the modified expense item.
   */
  modifyActualItem(budgetItem: ActualItem, action: string): Observable<ActualItem> {
    switch (action) {
      case Modify.Add:
        return this.httpService.postItem<ActualItem>(budgetItem, 'actualItem').pipe(tap((item) => this._addItem(item)));
      case Modify.Edit:
        return this.httpService.putItem<ActualItem>(budgetItem, 'actualItem').pipe(tap((item) => this._editItem(item)));
      case Modify.Delete:
        return this.httpService
          .deleteItem<ActualItem>(budgetItem, 'actualItem')
          .pipe(tap((item) => this.deleteItem(item, 'id')));
    }

    throw new HttpErrorResponse({ error: `${action}: ${this.translate.instant('error.unknown_event')}` });
  }

  /**
   * Sort table based on selected column. All columns except delete column can be sorted.
   * @param sort Holds the name of the column and sorting direction (optional).
   */
  sortData(sort?: Sort): void {
    const asc = sort ? sort.direction === 'asc' : true;
    const columnName = sort ? sort.active : 'purchaseDate';

    const items = this.getItemValues().sort((a, b) => {
      switch (columnName) {
        case 'purchaseDate':
          return compare(toDate(a.purchaseDate), toDate(b.purchaseDate), asc);
        case 'categoryName':
        case 'tripName':
        case 'currencyCode':
        case 'amount':
        case 'note':
          return compare(a[columnName], b[columnName], asc);
        default:
          return 0;
      }
    });
    this.setItems(items);
  }

  /**
   * Set filter for an individual filter item.
   * @param value The filter value.
   * @param filterType The type of filter currently used.
   */
  setFilterItem(value: any, filterType: string): void {
    const currentItem = this.getItemValue();

    switch (filterType) {
      case 'budgetYearId':
        currentItem.filter.budgetYearId = +value;
        break;
      case 'category':
        currentItem.filter.categoryId = +value;
        break;
      case 'trip':
        currentItem.filter.tripId = +value;
        break;
      case 'currencyCode':
        currentItem.filter.currencyCode = value as string;
        break;
      case 'note':
        currentItem.filter.note = value as string;
        break;
    }

    const updatedItem = { ...currentItem };
    this.setItem(updatedItem);
    ItemFilter.setFilter(currentItem.filter);
  }

  /**
   * Validates that a year exists in a budget.
   * @param purchaseDate The current date for an acutal expense.
   * @returns True if a year does not exist in the selected budget.
   */
  budgetYearNotExist(purchaseDate: Date): boolean {
    const yearFound = this.getItemValue().budgetYears.find(
      (x) => x.year === new Date(toDate(purchaseDate)).getFullYear()
    );
    return yearFound ? false : true;
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Add expense item if the modified item is inculded in current filter.
   * @param item The expense item to be added.
   */
  private _addItem(item: ActualItem): void {
    if (this.isYearInFilter(new Date(item.purchaseDate).getFullYear())) {
      item.tripId = item.tripId == null ? item.tripId : -1;
      this.addItem(item);
    }
  }

  /**
   * Edit an expense item or delete it if the item is inculded in current filter.
   * @param item The expense item to be modified or deleted.
   */
  private _editItem(item: ActualItem): void {
    if (this.isYearInFilter(new Date(item.purchaseDate).getFullYear())) {
      item.tripId = item.tripId == null ? item.tripId : -1;
      this.editItem(item, 'id');
    } else {
      this.deleteItem(item, 'id');
    }
  }

  /**
   * Check if a year exists in the current filter.
   * @param purchaseDate The year in which det purchase was made.
   * @returns True if year exists in filter or if no filter is set which represent all years.
   */
  private isYearInFilter(purchaseYear: number): boolean {
    const budgetYearId = this.getItemValue().filter.budgetYearId;
    const budgetYear = this.getItemValue().budgetYears.find((x) => x.id === budgetYearId);

    if ((budgetYear && purchaseYear === budgetYear.year) || budgetYearId === -1) {
      return true;
    }

    return false;
  }
}
