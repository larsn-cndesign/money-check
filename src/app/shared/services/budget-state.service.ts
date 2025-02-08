import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BudgetState } from '../classes/budget-state.model';
import { StoreItemAsync } from '../classes/store';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetStateService extends StoreItemAsync<BudgetState> {
  constructor(private httpService: HttpService) {
    super(new BudgetState());
  }

  /**
   * Get budget state from `localStorage`. If `localStorage` is not found,
   * load it from server and make sure to save it in `localStorage`.
   */
  getBudgetState(): Observable<BudgetState> {
    const budgetState = BudgetState.getLocalStorage();

    if (budgetState.budgets.length !== 0) {
      this.updateBudgetState(budgetState);
      return of(budgetState);
    }

    return this.httpService.getItem<BudgetState>('budget/state').pipe(
      tap((budgetState) => {
        this.updateBudgetState(budgetState);
      })
    );
  }

  /**
   * Store budget in localStorage and in memory store.
   * @description If `budgetId` is -1, set it to the first budget's the identity number.
   * @param state The budget to store.
   */
  setBudgetSate(budgetState: BudgetState): void {
    if (budgetState.budgetId === -1 && budgetState.budgets.length > 0) {
      budgetState.budgetId = budgetState.budgets[0].id;
      budgetState.budgetName = budgetState.budgets[0].budgetName;
    }

    this.updateBudgetState(budgetState);
  }

  /**
   * Store selected budget in localStorage and in memory store.
   * @param budgetId The identity number of the selected budget.
   */
  changeBudget(budgetId: number): void {
    const budgetState = this.getItemValue();
    const budget = budgetState.budgets.find((x) => x.id === budgetId);

    const updatedBudgetState = {
      ...budgetState,
      budgetId: budgetId,
      budgetName: budget ? budget.budgetName : '',
    };

    this.updateBudgetState(updatedBudgetState);
  }

  /**
   * Emit current value of type BudgetState to subscribers.
   */
  private updateBudgetState(budgetState: BudgetState): void {
    this.setItem(budgetState);
    BudgetState.setLocalStorage(budgetState);
  }
}
