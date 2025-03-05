import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isNumber } from 'src/app/shared/classes/common.fn';
import { StoreItem } from 'src/app/shared/classes/store';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { HttpService } from 'src/app/shared/services/http.service';
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
   * Creates a BudgetVersionService.
   * @param currencyTableService A service for managing currencies.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private currencyTableService: CurrencyTableService, private httpService: HttpService) {
    super(new ManageBudgetYear());
  }

  /**
   * Get all availables budget years.
   * @param budgetId The identifier of a budget.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  getBudgetYear(budgetId: number): Observable<ManageBudgetYear> {
    return this.httpService.getItemById<ManageBudgetYear>(budgetId, 'budgetYear').pipe(
      tap((budgetYear) => {
        if (budgetYear) {
          this.setItem(budgetYear);
          this.currencyTableService.items = budgetYear.currencies;
        }
      })
    );
  }

  /**
   * Create a new budget year for a budget.
   * @param budgetYear The budget year objcet to create.
   * @returns Observer of a `BudgetYear` object.
   */
  addBudgetYear(budgetYear: ManageBudgetYear): Observable<BudgetYear> {
    return this.httpService.postItemVar<ManageBudgetYear, BudgetYear>(budgetYear, 'budgetYear').pipe(
      tap((year) => {
        const currentItem = this.getItemValue();
        const updatedItem = { ...currentItem, copy: true, budgetYears: [...currentItem.budgetYears, year] };
        this.setItem(updatedItem);

        this.currencyTableService.items = budgetYear.currencies;
      })
    );
  }

  /**
   * Delete a budget year from a budget.
   * @param budgetYear The budget year objcet to be deleted.
   * @returns Observer of a boolean type.
   */
  deleteBudgetYear(budgetYear: BudgetYear): Observable<void> {
    return this.httpService
      .deleteItemVar<BudgetYear, void>(budgetYear, 'budgetYear')
      .pipe(tap(() => this.removeBudgetYear(budgetYear.id)));
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

    return this.getItemValue().budgetYears.findIndex((x) => x.year === +year) !== -1;
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

    const index = this.getItemValue().budgetYears.findIndex((x) => x.id === budgetYearId);
    return index !== -1 ? this.getItemValue().budgetYears[index] : budgetYear;
  }

  /**
   * Toggle the state of the previous version should be copied or not.
   * @param copyVersion A flag that indicates if previous version including budget items should be copied.
   */
  changeCopyBudget(copyVersion: boolean): void {
    const updatedItem = { ...this.getItemValue(), copy: copyVersion };
    this.setItem(updatedItem);
  }

  /**
   * Remove a budget year from store.
   * @param id The identifier of a budget year
   */
  private removeBudgetYear(id: number): void {
    const currentItem = this.getItemValue();
    const updatedItem = {
      ...currentItem,
      budgetYears: currentItem.budgetYears.filter((x) => x.id !== id),
    };

    this.setItem(updatedItem);
  }
}
