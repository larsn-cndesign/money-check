import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BudgetItem, ManageBudgetItem } from './butget-item.model';

/**
 * Class representing a service for managing budget expense items.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetItemService extends StoreItem<ManageBudgetItem, BudgetItem> {
  /**
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Initializes services.
   * @param http Manage http requests.
   * @param errorService Application error service.
   */
  constructor(private http: HttpClient, private errorService: ErrorService) {
    super(new ManageBudgetItem());
  }

  /**
   * Get budget items after applying a filter.
   * @param budgetId The identifier of a budget.
   * @returns Observer of `ManageBudgetItem` class.
   */
  getBudgetItems(budgetId: number): Observable<ManageBudgetItem> {
    const filter = this.item.filter;
    filter.budgetId = budgetId;

    return this.http.post<ManageBudgetItem>(`/api/GetBudgetItems`, { filter }, this.httpOptions).pipe(
      tap((budgetItem) => {
        if (budgetItem) {
          this.store.item = budgetItem;
          this.store.items = budgetItem.budgetItems;
          this.updateStore();
          this.updateStoreItems(false);
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Modify a budget item.
   * @param budgetItem The budget item to be modified
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `BudgetItem` representing the modified budget item.
   */
  modifyBudgetItem(budgetItem: BudgetItem, action: string): Observable<BudgetItem> {
    return this.http.post<BudgetItem>(`/api/${action}BudgetItem`, { budgetItem }, this.httpOptions).pipe(
      tap((item) => {
        switch (action) {
          case Modify.Add:
            this.addItem(item);
            break;
          case Modify.Edit:
            this.editItem(item, 'id');
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
   * Validates unique constraint on category and unit.
   * @param categoryId The identity number of a category item
   * @param unitId The identity number of a unit item
   * @param action The action to perform (add, edit or delete).
   * @returns True if the uniqe constraint is violated.
   */
  unique(categoryId: number, unitId: number, action: string): boolean {
    if (!categoryId || !unitId || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.categoryId === categoryId && x.unitId === unitId) !== -1;
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
    }
    ItemFilter.setFilter(this.item.filter);
  }
}
