import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreItem } from 'src/app/shared/classes/store';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
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
   * A property holding http header information
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
   * Method to get an open version with currencies for the selected year.
   * @param @param budgetYear The selected budget year object to get the current version for.
   * @returns Observer of a `ManageBudgetYear` object.
   */
  getCurrentVersion(budgetYear: BudgetYear): Observable<ManageBudgetYear> {
    return this.http.post<ManageBudgetYear>(`/api/GetCurrentVersion`, { budgetYear }, this.httpOptions).pipe(
      tap((item: ManageBudgetYear) => {
        item.copy = this.store.item.copy; // Preserve copy state.
        this.store.item = item;
        this.updateStore();

        this.currencyTableService.items = item.currencies;
        this.currencyTableService.updateStore();
      })
    );
  }

  /**
   * Method to create a new version.
   * @param budgetYear A budget year obejct that includes the version to be created
   * @returns Observer of a `boolean` object.
   */
  createVersion(budgetYear: ManageBudgetYear): Observable<boolean> {
    return this.http.post<boolean>(`/api/CreateVersion`, { budgetYear }, this.httpOptions).pipe(
      tap(() => {
        this.currencyTableService.items = [];
        this.currencyTableService.updateStore();
      })
    );
  }

  /**
   * Method to delete a version.
   * @description When deleting a version the previous version is reopened.
   * @returns Observer of a `boolean` object.
   */
  deleteVersion(): Observable<boolean> {
    const budgetYear = this.store.item;

    return this.http.post<boolean>(`/api/DeleteVersion`, { budgetYear }, this.httpOptions).pipe(
      tap(() => {
        this.currencyTableService.items = [];
        this.currencyTableService.updateStore();
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
    this.item.version.versionName = versionName;
    this.item.currencies = this.currencyTableService.items;

    const budgetYear = this.item;

    return this.http.post<boolean>(`/api/UpdateVersion`, { budgetYear }, this.httpOptions).pipe(
      tap(() => {
        this.currencyTableService.items = [];
        this.currencyTableService.updateStore();
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

    let array = [...this.store.item.versions];
    array = array.filter((x) => x.versionName !== this.store.item.version.versionName);

    return array.findIndex((x) => x.versionName.toLowerCase() === value.toLowerCase()) !== -1;
  }

  /**
   * Toggle the state of the previous version should be copied or not.
   * @param copyVersion A flag that indicates if previous version including budget items should be copied.
   */
  changeCopyBudget(copyVersion: boolean): void {
    this.item.copy = copyVersion;
    this.updateStore();
  }

  /**
   * Get current budget year from selected year identifier.
   * @param budgetYearId A unique identifier of a year.
   */
  getBudgetYearItem(budgetYearId: number): BudgetYear | undefined {
    return this.item.budgetYears.find((x) => x.id === budgetYearId);
  }
}
