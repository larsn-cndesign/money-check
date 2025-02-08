import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreItem } from 'src/app/shared/classes/store';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { BudgetYear, ManageBudgetYear } from '../../budget-year/shared/budget-year.model';

/**
 * Class representing a service for managing budget versions.
 * @extends StoreItem
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetVersionService extends StoreItem<ManageBudgetYear> {
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
   * Method to get an open version with currencies for the selected year.
   * @param @param id The identifier of the selected budget year to get the current version for.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  getCurrentVersion(budgetYearId: number): Observable<ManageBudgetYear> {
    return this.httpService.getItemById<ManageBudgetYear>(budgetYearId, 'budgetVersion').pipe(
      tap((budgetYear) => {
        if (budgetYear) {
          this.setItem(budgetYear);
          this.currencyTableService.items = budgetYear.currencies;
        }
      })
    );
  }

  /**
   * Method to create a new version.
   * @param budgetYear A budget year obejct that includes the version to be created
   * @returns Observer of a `boolean` object.
   */
  addVersion(budgetYear: ManageBudgetYear): Observable<boolean> {
    return this.httpService.postItemVar<ManageBudgetYear, boolean>(budgetYear, 'budgetVersion').pipe(
      tap(() => {
        this.currencyTableService.items = [];
      })
    );
  }

  /**
   * Method to delete a version.
   * @description When deleting a version the previous version is reopened.
   * @returns Observer of a `boolean` object.
   */
  deleteVersion(): Observable<boolean> {
    const budgetYear = this.getItemValue().budgetYear;

    return this.httpService.deleteItemVar<BudgetYear, boolean>(budgetYear, 'budgetVersion').pipe(
      tap(() => {
        this.currencyTableService.items = [];
      })
    );
  }

  /**
   * Method to update the name of the version.
   * @param versionName The name of the version.
   * It can be anything but is recommended to use version numbering such as 1.0.0.
   * @returns
   */
  updateVersion(versionName: string): Observable<boolean> {
    const currentItem = this.getItemValue();

    const budgetYear = {
      ...currentItem,
      version: { ...currentItem.version, versionName: versionName },
      currencies: this.currencyTableService.items(),
    };

    return this.httpService.putItemVar<ManageBudgetYear, boolean>(budgetYear, 'budgetVersion').pipe(
      tap(() => {
        this.currencyTableService.items = [];
      })
    );
  }

  /**
   * Validates unique constraint on version name.
   * @param value The new name of a version.
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string): boolean {
    if (!value) {
      return false;
    }

    let array = [...this.getItemValue().versions];
    array = array.filter((x) => x.versionName !== this.getItemValue().version.versionName);

    return array.findIndex((x) => x.versionName.toLowerCase() === value.toLowerCase()) !== -1;
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
   * Get current budget year from selected year identifier.
   * @param budgetYearId A unique identifier of a year.
   */
  getBudgetYearItem(budgetYearId: number): BudgetYear | undefined {
    return this.getItemValue().budgetYears.find((x) => x.id === budgetYearId);
  }
}
