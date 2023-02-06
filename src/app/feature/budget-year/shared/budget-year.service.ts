import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNumber } from 'src/app/shared/classes/common.fn';
import { StoreItem } from 'src/app/shared/classes/store';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { BudgetYear, Currency, ManageBudgetYear } from './budget-year.model';

/**
 * Class representing a budget year service.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetYearService extends StoreItem<ManageBudgetYear, Currency> {
  /**
   * A property holding http header information.
   * @private
   * @readonly
   */
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Creates a BudgetVersionService.
   * @param http Manage http requests.
   * @param currencyTableService A service for managing currencies.
   */
  constructor(private http: HttpClient, private currencyTableService: CurrencyTableService) {
    super(new ManageBudgetYear());
  }

  /**
   * Get all availables budget years.
   * @param budgetId The identifier of a budget.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  getBudgetYear(budgetId: number): Observable<ManageBudgetYear> {
    return this.http.get<ManageBudgetYear>('/api/GetBudgetYear', { params: { budgetId } }).pipe(
      tap((budgetYear) => {
        if (budgetYear) {
          this.store.item = budgetYear;
          this.updateStore();

          this.currencyTableService.items = budgetYear.currencies;
          this.currencyTableService.updateStore();
        }
      })
    );
  }

  /**
   * Create a new budget year for a budget.
   * @param budgetYear The budget year objcet to create.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  createBudgetYear(budgetYear: ManageBudgetYear): Observable<ManageBudgetYear> {
    return this.http.post<ManageBudgetYear>(`/api/CreateBudgetYear`, { budgetYear }, this.httpOptions).pipe(
      tap((resultBudgetYear) => {
        this.store.item = resultBudgetYear;
        this.updateStore();

        this.currencyTableService.items = budgetYear.currencies;
        this.currencyTableService.updateStore();
      })
    );
  }

  /**
   * Delete a budget year from a budget.
   * @param budgetYear The budget year objcet to be deleted.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  deleteBudgetYear(budgetYear: BudgetYear): Observable<ManageBudgetYear> {
    return this.http.post<ManageBudgetYear>(`/api/DeleteBudgetYear`, { budgetYear }, this.httpOptions).pipe(
      tap((resultBudgetYear) => {
        this.store.item = resultBudgetYear;
        this.updateStore();
      })
    );
  }

  /**
   * Validates unique constraint on a year.
   * @param year The year to check.
   * @returns True if the uniqe constraint is violated.
   */
  yearExist(year: string): boolean {
    if (!year || !isNumber(year)) {
      return false;
    }

    return this.item.budgetYears.findIndex((x) => x.year === +year) !== -1;
  }

  /**
   * Get a budget year object from a selected year identifier.
   * @param budgetYearId The year identifier.
   * @returns A `BudgetYear` object.
   */
  getSelectedBudgetYear(budgetYearId: number | null): BudgetYear {
    const budgetYear: BudgetYear = { id: -1, budgetId: -1, year: -1 };

    if (!budgetYearId) {
      return budgetYear;
    }

    const index = this.item.budgetYears.findIndex((x) => x.id === budgetYearId);
    return index !== -1 ? this.item.budgetYears[index] : budgetYear;
  }

  /**
   * Toggle the state of the previous version should be copied or not.
   * @param copyVersion A flag that indicates if previous version including budget items should be copied.
   */
  changeCopyBudget(copyVersion: boolean): void {
    this.item.copy = copyVersion;
    this.updateStore();
  }
}
