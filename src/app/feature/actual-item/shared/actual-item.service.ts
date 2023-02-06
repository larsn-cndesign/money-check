import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { compare, toDate } from 'src/app/shared/classes/common.fn';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ActualItem, ManageActualItem } from './actual-item.model';

/**
 * Class representing a service for managing actual expense items.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class ActualItemService extends StoreItem<ManageActualItem, ActualItem> {
  /**
   * A property holding http header information.
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Creates an actual item services.
   * @param http Manage http requests.
   * @param errorService A service for managing application errors.
   */
  constructor(private http: HttpClient, private errorService: ErrorService) {
    super(new ManageActualItem());
  }

  /**
   * Get actual expenses after applying a filter.
   * @param budgetId The identifier of a budget.
   * @returns Observer of `ManageActualItem` class.
   */
  getActualItems(budgetId: number): Observable<ManageActualItem> {
    const filter = this.item.filter;
    filter.budgetId = budgetId;

    return this.http.post<ManageActualItem>(`/api/GetActualItems`, { filter }, this.httpOptions).pipe(
      tap((item) => {
        if (item) {
          this.store.item = item;
          this.store.items = item.actualItems;
          this.updateStore();
          this.updateStoreItems();
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Modify an enxpense item.
   * @param actualItem The expense item to be modified.
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `ActualItem` representing the modified expense item.
   */
  modifyActualItem(actualItem: ActualItem, action: string): Observable<ActualItem> {
    return this.http.post<ActualItem>(`/api/${action}ActualItem`, { actualItem }, this.httpOptions).pipe(
      tap((item) => {
        switch (action) {
          case Modify.Add:
            this._addItem(item);
            break;
          case Modify.Edit:
            this._editItem(item);
            break;
          case Modify.Delete:
            this.deleteItem(item, 'id');
            break;
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Sort table based on selected column. All columns except delete column can be sorted.
   * @param sort Holds the name of the column and sorting direction (optional).
   */
  sortData(sort?: Sort): void {
    const asc = sort ? sort.direction === 'asc' : true;
    const columnName = sort ? sort.active : 'purchaseDate';

    this.store.items = this.items.sort((a, b) => {
      switch (columnName) {
        case 'purchaseDate':
          return compare(toDate(a.purchaseDate), toDate(b.purchaseDate), asc);
        case 'categoryName':
        case 'tripName':
        case 'currency':
        case 'amount':
        case 'note':
          return compare(a[columnName], b[columnName], asc);
        default:
          return 0;
      }
    });

    this.updateStoreItems();
  }

  /**
   * Set filter for an individual filter item.
   * @param value The filter value.
   * @param filterType The type of filter currently used.
   */
  setFilterItem(value: any, filterType: string): void {
    switch (filterType) {
      case 'budgetYearId':
        this.item.filter.budgetYearId = +value;
        break;
      case 'category':
        this.item.filter.categoryId = +value;
        break;
      case 'trip':
        this.item.filter.tripId = +value;
        break;
      case 'currency':
        this.item.filter.currency = value as string;
        break;
      case 'note':
        this.item.filter.note = value as string;
        break;
    }
    ItemFilter.setFilter(this.item.filter);
  }

  /**
   * Validates that a year exists in a budget.
   * @param purchaseDate The current date for an acutal expense.
   * @returns True if a year does not exist in the selected budget.
   */
  budgetYearNotExist(purchaseDate: Date): boolean {
    const yearFound = this.item.budgetYears.find((x) => x.year === new Date(toDate(purchaseDate)).getFullYear());
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
      this.addItem(item);
    }
  }

  /**
   * Edit an expense item or delete it if the item is inculded in current filter.
   * @param item The expense item to be modified or deleted.
   */
  private _editItem(item: ActualItem): void {
    if (this.isYearInFilter(new Date(item.purchaseDate).getFullYear())) {
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
    const budgetYearId = this.item.filter.budgetYearId;
    const budgetYear = this.item.budgetYears.find((x) => x.id === budgetYearId);

    if ((budgetYear && purchaseYear === budgetYear.year) || budgetYearId === -1) {
      return true;
    }

    return false;
  }
}