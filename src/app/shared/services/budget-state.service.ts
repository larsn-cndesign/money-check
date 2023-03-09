import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BudgetState } from '../classes/budget-state.model';
import { ItemFilter } from '../classes/filter';
import { StoreItem } from '../classes/store';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetStateService extends StoreItem<BudgetState> {
  /**
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient, private errorService: ErrorService) {
    super(new BudgetState());
  }

  /**
   * Get budget state from `localStorage`. If `localStorage` is not found,
   * load it from server and make sure to save it in `localStorage`.
   * @returns Observer of a `BudgetState` object.
   */
  getBudgetState(): Observable<BudgetState> {
    const budgetState = BudgetState.getLocalStorage();

    if (budgetState.budgets.length !== 0) {
      this.store.item = budgetState;
      this.updateStore();
      return of(budgetState);
    }

    return this.http.get<BudgetState>(`/api/GetBudgetState`, this.httpOptions).pipe(
      tap((item) => {
        this.store.item = item;
        this.updateStore();
        BudgetState.setLocalStorage(this.store.item);
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  getBudgetStateInStore(): Observable<BudgetState> {
    return this.item$;
  }

  /**
   * Store budget in localStorage and in memory store.
   * @description If `budgetId` is -1, set it to the first budget's the identity number.
   * @param state The budget to store.
   */
  setBudgetSate(state: BudgetState): void {
    if (state.budgetId === -1 && state.budgets.length > 0) {
      state.budgetId = state.budgets[0].id;
      state.budgetName = state.budgets[0].budgetName;
    }

    this.item = state;
    this.storeBudgetState();
  }

  /**
   * Store selected budget in localStorage and in memory store.
   * @param budgetId The identity number of the selected budget.
   */
  changeBudget(budgetId: number): void {
    this.item.budgetId = budgetId;
    const budget = this.item.budgets.find((x) => x.id === budgetId);
    this.item.budgetName = budget ? budget.budgetName : '';
    this.storeBudgetState();
  }

  /**
   * Store budget in localStorage and in memory store.
   */
  private storeBudgetState(): void {
    BudgetState.setLocalStorage(this.item);
    // TODO ?
    // const filter = ItemFilter.getFilter();
    // ItemFilter.setFilter(new ItemFilter()); // Clear filter
    this.updateStore();
  }
}
