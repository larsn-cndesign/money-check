import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { compare } from 'src/app/shared/classes/common.fn';
import { ItemFilter } from 'src/app/shared/classes/filter';
import { StoreItem } from 'src/app/shared/classes/store';
import { ErrorService } from 'src/app/shared/services/error.service';
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
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Creates a budget varaiance.
   * @param http Manage http requests
   * @param errorService Application error service
   */
  constructor(private http: HttpClient, private errorService: ErrorService, private router: Router) {
    super(new BudgetVariance());
  }

  /**
   * Get budget varaiance for all budget and actual categories from server.
   * @param budgetId The identifier of a budget.
   * @returns Observer of `BudgetVariance` object.
   */
  loadVariancePage(budgetId: number): Observable<BudgetVariance> {
    return this.http.get<BudgetVariance>('/api/LoadVariancePage', { params: { budgetId } }).pipe(
      tap((item) => {
        if (item) {
          this.store.item = item;
          this.store.items = item.varianceItems;
          this.updateStore();
          this.updateStoreItems(false);
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Get filtered budget varaiance for budget and actual from server.
   * @returns Observer of `BudgetVariance` class
   */
  getVarianceItems(): Observable<BudgetVariance> {
    const filter = this.item.filter;

    return this.http.post<BudgetVariance>(`/api/GetVarianceItems`, { filter }, this.httpOptions).pipe(
      tap((item) => {
        if (item) {
          this.store.item = item;
          this.store.items = item.varianceItems;
          this.updateStore();
          this.updateStoreItems(false);
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
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
      case 'version':
        this.item.filter.versionId = +value;
        break;
      case 'currency':
        this.item.filter.currency = value;
        break;
    }
    ItemFilter.setFilter(this.item.filter);
  }

  /**
   * Sort table based on selected column. All columns can be sorted.
   * @param sort Holds the name of the column and sorting direction (optional).
   */
  sortData(sort?: Sort): void {
    const asc = sort ? sort.direction === 'asc' : true;
    const columnName = sort ? sort.active : 'category';

    this.store.items = this.items.sort((a, b) => {
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

    this.updateStoreItems();
  }

  /**
   * Navigates to the details of the selected budget or actual item.
   * @param item Details of an item (budget or actual).
   * @param type The type of item (budget or actual).
   */
  gotoDetails(item: VarianceItem, type: string): void {
    const filter = new ItemFilter();
    filter.budgetYearId = this.item.filter.budgetYearId;
    const catgegory = this.item.categories.find((x) => x.categoryName === item.category);
    filter.categoryId = catgegory ? catgegory.id : -1;

    ItemFilter.setFilter(filter);

    if (type === 'budget') {
      this.router.navigate(['/feature/budget-item']);
    } else {
      this.router.navigate(['/feature/actual-item']);
    }
  }
}
