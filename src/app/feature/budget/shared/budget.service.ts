import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Budget } from './budget.model';

/**
 * Class representing a service for managing a budget.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetService extends StoreItems<Budget> {
  /**
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Create a budget.
   * @param http Manage http requests
   * @param errorService Application error service
   */
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private budgetStateService: BudgetStateService
  ) {
    super();
  }

  /**
   * Get all budgets from server
   * @returns Observer of an array of `Budget` objects
   */
  loadBudgetPage(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`/api/LoadBudgetPage`, this.httpOptions).pipe(
      tap((items) => {
        this.store.items = items;
        this.updateStore();
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Modify a budget and store it in `localStorage` and in memory store..
   * @param budget The budget to be modified.
   * @param action The action to perform (add, edit).
   * @returns An observable of a `Budget` representing the modified budget.
   * @todo Add possibillity to delete a budget.
   */
  modifyBudget(budget: Budget, action: string): Observable<Budget> {
    return this.http.post<Budget>(`/api/${action}Budget`, { budget }, this.httpOptions).pipe(
      tap((item) => {
        switch (action) {
          case Modify.Add:
            this.addItem(item);
            break;
          case Modify.Edit:
            this.editItem(item, 'id');
            break;
        }

        this.updateBudgetState();
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Validates unique constraint on budget name.
   * @param value The new name of a budget
   * @param action The action to perform (add or edit).
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.budgetName.toLowerCase() === value.toLowerCase()) !== -1;
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to update budget state in `localStorage` and memory store.
   * @description Get stored items from `localStorage` and modifies it with updated budget.
   */
  private updateBudgetState(): void {
    const budgetState = BudgetState.getLocalStorage();
    budgetState.budgets = this.items;
    budgetState.hasBudget = true;
    this.budgetStateService.setBudgetSate(budgetState);
  }
}
