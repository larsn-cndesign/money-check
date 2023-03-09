import { ItemFilter } from 'src/app/shared/classes/filter';
import { BudgetYear } from '../../budget-year/shared/budget-year.model';
import { Category } from '../../category/shared/category.model';
import { Trip } from '../../trip/shared/trip.model';

/**
 * Class representing a wrapper for an actal item.
 */
export class ManageActualItem {
  /**
   * A property holding filter values for an array of items i.e. Category, Curency.
   * @public
   * @default new ItemFilter() Creates a new filter.
   */
  filter = new ItemFilter();

  /**
   * Holds an array of `BudgetYear` objects for a particular budget.
   * @public
   * @default BudgetYear[] An empty array of `BudgetYear` objects.
   */
  budgetYears: BudgetYear[] = [];

  /**
   * Holds an array of `ActualItem` objects for a particular budget, taking filters into account
   * @public
   * @default ActualItem[] An empty array of `ActualItem` objects.
   */
  actualItems: ActualItem[] = [];

  /**
   * Holds all available categories for a budget.
   * @public
   * @default Category[] An empty array of `Category` objects.
   */
  categories: Category[] = [];

  /**
   * Holds all available trips for a budget.
   * @public
   * @default Trip[] An empty array of `Trip` objects.
   */
  trips: Trip[] = [];

  /**
   * Holds all available currencies for the current version of a budget year.
   * @public
   * @default CurrencyItem[] An empty array of `CurrencyItem` objects.
   */
  currencyItems: CurrencyItem[] = [];

  /**
   * Holds uniqe currencies for the current version of a budget year.
   * @public
   * @default string[] An empty array of currencies represented as strings.
   */
  currencies: string[] = [];
}

/**
 * Class representing an actual item whichg holds information of an actual expense.
 */
export class ActualItem {
  /**
   * Unique identifier for an actual item.
   * @public
   * @default -1 Actual item not initialized.
   */
  id = -1;

  /**
   * Unique identifier for a budget.
   * @public
   * @default -1 Actual item not initialized.
   */
  budgetId = -1;

  /**
   * Unique identifier for a category.
   * @public
   * @default -1 Actual item not initialized.
   */
  categoryId = -1;

  /**
   * Unique identifierr for a trip.
   * @public
   * @default -1 Actual item not initialized.
   */
  tripId = -1;

  /**
   * The purchase date of an actual expense item.
   * @public
   * @default new Date() Actual item not initialized.
   */
  purchaseDate = new Date();

  /**
   * The currency of an actual expense item (3 characters).
   * @public
   * @default '' Actual item not initialized.
   * @example EUR
   */
  currency = '';

  /**
   * The amount of an expense item.
   * @public
   * @default 0 No amount.
   */
  amount = 0;

  /**
   * Notes of the actual expense. Could be anyting describing the actual expense.
   * @public
   * @default '' No note.
   */
  note = '';

  /**
   * Represent a selected actual item (optional). Used when an actual item is selected in a table.
   * @public
   * @note Not saved in the database.
   */
  selected?: boolean;

  /**
   * The category name of an actual item (optional). Gets the name from a Category item.
   * @public
   * @note Not saved in the database.
   */
  categoryName?: string;

  /**
   * The trip name of an actual item in the following format: [start date] / [end date] (optional).
   * Gets the name from a Trip item.
   * @public
   * @note Not saved in the database.
   * @example 2023-01-01 / 2023-01-31
   */
  tripName?: string;
}

/**
 * Interface representing a currency item.
 */
export interface CurrencyItem {
  /**
   * The currency of an expense item (3 characters).
   * @public
   * @example EUR
   */
  currency: string;

  /**
   * The budget rate of a currency for the current version of a `BudgetYear`.
   * @public
   * @example 10,75
   */
  budgetRate: number;

  /**
   * The budget rate of a currency for the current version of a `BudgetYear`.
   * @public
   * @example 10,75
   */
  averageRate: number;
}
