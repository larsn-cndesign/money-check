import { Selectable } from 'src/app/shared/interfaces/selectable';

/**
 * Interface representing a unit item.
 * @extends Selectable
 */
export interface Unit extends Selectable {
  /**
   * Unique identity number for a unit item.
   * @public
   */
  id: number;

  /**
   * Unique identity number of a budget.
   * @public
   */
  budgetId: number;

  /**
   * The name of the unit item.
   * @public
   */
  unitName: string;

  /**
   * A boolean flag that indicates if the selected unit use currency or not.
   * @public
   */
  useCurrency: boolean;
}
