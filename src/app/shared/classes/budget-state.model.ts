import { Budget } from 'src/app/feature/budget/shared/budget.model';

/**
 * Class representing the state of a budget.
 */
export class BudgetState {
  /**
   * An array of budgets (@default []).
   * @public
   */
  budgets: Budget[] = [];

  /**
   * A property representing the identity number of the selected budget (@default -1).
   * @private
   */
  budgetId = -1;

  /**
   * A property representing the name of the selected budget (@default -1).
   * @private
   */
  budgetName = '';

  /**
   * A boolean flag indicating if any budgets exists (@default false).
   * @public
   */
  hasBudget = false;

  /**
   * Method to get stored budget state from `localStorage`.
   * @static
   * @returns The budget state.
   */
  static getLocalStorage(): BudgetState {
    const budgetState = localStorage.getItem('budgetState');
    if (budgetState) {
      return JSON.parse(budgetState) as BudgetState;
    }

    return new BudgetState();
  }

  /**
   * Method to get the current selected budget id from `localStorage`.
   * @static
   * @returns The selected budget identity number or -1 if not found.
   */
  static getSelectedBudgetId(): number {
    const budgetState = this.getLocalStorage();
    const budget = budgetState.budgets.find((x) => x.id === budgetState.budgetId);

    return budget ? budget.id : -1;
  }

  /**
   * Method to store the budget sate in `localStorage`.
   * @static
   * @param budgetState The budget state to be stored.
   */
  static setLocalStorage(budgetState: BudgetState): void {
    localStorage.setItem('budgetState', JSON.stringify(budgetState));
  }
}
