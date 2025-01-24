import { FilterList } from '../components/filter-list/shared/filter-list.model';
import { LS_FILTER } from './constants';

/**
 * Class representing a filter for an array of items i.e. budget, actual, variance.
 */
export class ItemFilter {
  /**
   * An identifier for a budget. Represents the budget to set the filter for.
   * @public
   * @default -1 `ItemFilter` not initialized.
   */
  budgetId = -1;

  /**
   * Current version for a budget year.
   * @public
   * @default -1 `ItemFilter` not initialized.
   */
  versionId = -1;

  /**
   * Filter on year.
   * @public
   * @default -1 All years.
   */
  budgetYearId = -1;

  /**
   * Filter on category.
   * @public
   * @default -1 All categories.
   */
  categoryId = -1;

  /**
   * Filter on trip.
   * @public
   * @default -1 All trips.
   */
  tripId = -1;

  /**
   * Filter on currency code.
   * @public
   * @default '' All currencies.
   * @example EUR
   */
  currencyCode = '';

  /**
   * Filter on note.
   * @public
   * @default '' All notes.
   */
  note = '';

  /**
   * Filter on a list of items.
   * @public
   * @default [] An empty list.
   */
  list: FilterList[] = [];

  /**
   * Filter on month.
   * @public
   * @default -1 All months.
   */
  month = -1;

  /**
   * Filter on days traveled/stayed during the seleced period.
   * @public
   * @default false No filter.
   */
  travelDay = false;

  /**
   * The number of days traveled/stayed during the seleced period.
   * @public
   * @default 1 No filter = divide by 1.
   */
  travelDayCount = 1;

  /**
   * Method to get stored filter from `localStorage`.
   * @static
   * @returns A  filter to use on array of actual or budget items.
   */
  static getFilter(): ItemFilter {
    const storedFilter = localStorage.getItem(LS_FILTER);
    if (storedFilter) {
      return JSON.parse(storedFilter) as ItemFilter;
    }

    return new ItemFilter();
  }

  /**
   * Method to store a filter in `localStorage`.
   * @static
   * @param filter The filter item to be stored.
   */
  static setFilter(filter: ItemFilter): void {
    localStorage.setItem(LS_FILTER, JSON.stringify(filter));
  }
}
