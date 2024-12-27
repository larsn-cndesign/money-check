import { Selectable } from 'src/app/shared/interfaces/selectable';

/**
 * Interface representing a trip in a date range.
 * @extends Selectable
 */
export interface Trip extends Selectable {
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
   * The starting date of a trip.
   * @public
   */
  fromDate: Date;

  /**
   * The ending date of a trip.
   * @public
   */
  toDate: Date;

  /**
   * Notes of the trip. Could for example show the total trip dates when splitting expenses.
   * @public
   * @default '' No note.
   */
  note: string;
}
