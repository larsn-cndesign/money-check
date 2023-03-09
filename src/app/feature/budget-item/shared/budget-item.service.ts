import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
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
   * Initializes services.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private httpService: HttpService) {
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
    // console.log(filter); // TODO ?

    return this.httpService.postItemVar<ItemFilter, ManageBudgetItem>(filter, 'budgetItem/get').pipe(
      tap((budgetItem) => {
        if (budgetItem) {
          this.store.item = budgetItem;
          this.store.items = budgetItem.budgetItems;
          this.updateStore();
          this.updateStoreItems(false);
        }
      })
    );
  }

  /**
   * Modify a budget item.
   * @param budgetItem The budget item to be modified
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `BudgetItem` representing the modified budget item.
   */
  modifyBudgetItem(budgetItem: BudgetItem, action: string): Observable<BudgetItem> {
    switch (action) {
      case Modify.Add:
        return this.httpService.postItem<BudgetItem>(budgetItem, 'budgetItem').pipe(tap((item) => this.addItem(item)));
      case Modify.Edit:
        return this.httpService
          .putItem<BudgetItem>(budgetItem, 'budgetItem')
          .pipe(tap((item) => this.editItem(item, 'id')));
      case Modify.Delete:
        return this.httpService
          .deleteItem<BudgetItem>(budgetItem, 'budgetItem')
          .pipe(tap((item) => this.deleteItem(item, 'id')));
    }

    throw new HttpErrorResponse({ error: `${action}: okänd händelse` });
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
