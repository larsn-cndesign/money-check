import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { compare } from 'src/app/shared/classes/common.fn';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { FilterList } from 'src/app/shared/components/filter-list/shared/filter-list.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { BudgetVariance, VarianceItem } from './budget-variance.model';

/**
 * Class representing a service for managing budget variance.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetVarianceService extends StoreItem<BudgetVariance, VarianceItem> {
  /**
   * Creates a budget varaiance.
   * @param router Navigation service.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private router: Router, private httpService: HttpService) {
    super(new BudgetVariance());
  }

  /**
   * Get budget varaiance for all budget and actual categories from server.
   * @param budgetId The identifier of a budget.
   * @returns Observer of `BudgetVariance` object.
   */
  loadVariancePage(budgetId: number): Observable<BudgetVariance> {
    const filter = new ItemFilter();
    filter.budgetId = budgetId;

    const currentItem = this.getItemValue();
    const updatedItem = { ...currentItem, filter: filter };
    this.setItem(updatedItem);

    return this.getVarianceItems();
  }

  /**
   * Get filtered budget varaiance for budget and actual from server.
   * @returns Observer of `BudgetVariance` class
   */
  getVarianceItems(): Observable<BudgetVariance> {
    const filter = this.getItemValue().filter;

    return this.httpService.postItemVar<ItemFilter, BudgetVariance>(filter, 'varianceItem/get').pipe(
      tap((item) => {
        if (item) {
          this.setItem(item);
          this.setItems(item.varianceItems);
        }
      })
    );
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
        currentItem.filter.versionId = -1;
        currentItem.filter.currencyCode = '';
        currentItem.filter.month = -1;
        break;
      case 'version':
        currentItem.filter.versionId = +value;
        currentItem.filter.currencyCode = '';
        currentItem.filter.month = -1;
        break;
      case 'currencyCode':
        currentItem.filter.currencyCode = value;
        currentItem.filter.month = -1;
        break;
      case 'month':
        currentItem.filter.month = value;
        break;
      case 'day':
        currentItem.filter.travelDay = value;
        break;
    }

    const updatedItem = { ...currentItem };
    this.setItem(updatedItem);
    ItemFilter.setFilter(currentItem.filter);
  }

  /**
   * Get filtered list or initialize it if neccessary.
   */
  getFilterList(): FilterList[] {
    const currentItem = this.getItemValue();

    let filterList = currentItem.filter.list;

    if (filterList.length === 0) {
      filterList = currentItem.categories.map((category) => ({
        id: category.id,
        name: category.categoryName,
        selected: true,
      }));

      const updatedItem = { ...currentItem, filter: { ...currentItem.filter, list: filterList } } as BudgetVariance;
      this.setItem(updatedItem);
    }

    return filterList;
  }

  /**
   * Sort table based on selected column. All columns can be sorted.
   * @param sort Holds the name of the column and sorting direction (optional).
   */
  sortData(sort?: Sort): void {
    const asc = sort ? sort.direction === 'desc' : true;
    const columnName = sort ? sort.active : 'category';

    const items = this.getItemValues().sort((a, b) => {
      switch (columnName) {
        case 'category':
        case 'budget':
        case 'actual':
        case 'variance':
          return compare(a[columnName], b[columnName], asc);
        default:
          return 0;
      }
    });
    this.setItems(items);
  }

  /**
   * Navigates to the details of the selected budget or actual item.
   * @param item Details of an item (budget or actual).
   * @param type The type of item (budget or actual).
   */
  gotoDetails(item: VarianceItem, type: string): void {
    const filter = new ItemFilter();
    const currentItem = this.getItemValue();

    filter.budgetYearId = currentItem.filter.budgetYearId;
    const catgegory = currentItem.categories.find((x) => x.categoryName === item.category);
    filter.categoryId = catgegory ? catgegory.id : -1;
    filter.currencyCode = currentItem.filter.currencyCode;

    ItemFilter.setFilter(filter);

    if (type === 'budget') {
      this.router.navigate(['/feature/budget-item']);
    } else {
      this.router.navigate(['/feature/actual-item']);
    }
  }
}
