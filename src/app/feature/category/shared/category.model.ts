import { Selectable } from 'src/app/shared/interfaces/selectable';

/**
 * Interface representing a category item.
 * @extends Selectable
 */
export interface Category extends Selectable {
  /**
   * Unique identity number for a budget item.
   * @public
   */
  id: number;

  /**
   * Unique identity number of a budget.
   * @public
   */
  budgetId: number;

  /**
   * The name of the category item.
   * @public
   */
  categoryName: string;
}
