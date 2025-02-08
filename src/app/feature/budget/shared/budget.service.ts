import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { HttpService } from 'src/app/shared/services/http.service';
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
   * Create a budget.
   * @param budgetStateService Helper service for managing the state of a budget.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private budgetStateService: BudgetStateService, private httpService: HttpService) {
    super();
  }

  /**
   * Get all budgets from server
   * @returns Observer of an array of `Budget` objects
   */
  getBudgets(): Observable<Budget[]> {
    return this.httpService.getAllItems<Budget>('budget').pipe(
      tap((items) => {
        this.items = items;
      })
    );
  }

  /**
   * Modify a budget and store it in `localStorage` and in memory store.
   * @param budget The budget to be modified.
   * @param action The action to perform (add, edit).
   * @returns An observable of a `Budget` representing the modified budget.
   * @todo Add possibillity to delete a budget.
   */
  modifyBudget(budget: Budget, action: string): Observable<Budget> {
    switch (action) {
      case Modify.Add:
        return this.httpService.postItem<Budget>(budget, 'budget').pipe(tap((item) => this.addItem(item)));
      case Modify.Edit:
        return this.httpService.putItem<Budget>(budget, 'budget').pipe(tap((item) => this.editItem(item, 'id')));
    }

    throw new HttpErrorResponse({ error: `${action}: okänd händelse` });
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

    const items = this.getItems(action === Modify.Edit);
    return items.findIndex((x) => x.budgetName.toLowerCase() === value.toLowerCase()) !== -1;
  }

  /**
   * Helper method to update budget state in `localStorage` and memory store.
   * @description Get stored items from `localStorage` and modifies it with updated budget.
   */
  updateBudgetState(): void {
    const budgetState = BudgetState.getLocalStorage();
    budgetState.budgets = this.items();
    budgetState.hasBudget = true;
    this.budgetStateService.setBudgetSate(budgetState);
  }
}
