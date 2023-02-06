import { Selectable } from 'src/app/shared/interfaces/selectable';

/**
 * Interface representing a budget.
 * @extends Selectable
 */
export interface Budget extends Selectable {
  /**
   * Unique identity number for a budget.
   * @public
   */
  id: number;

  /**
   * The name of the budget.
   * @public
   */
  budgetName: string;
}
