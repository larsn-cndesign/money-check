import { ItemFilter } from 'src/app/shared/classes/filter';
import { BudgetYear, Currency } from '../../budget-year/shared/budget-year.model';
import { Category } from '../../category/shared/category.model';
import { Unit } from '../../unit/shared/unit.model';
import { BudgetVersion } from '../../version/shared/budget-version.model';

/**
 * Class representing a wrapper for a budget item.
 */
export class ManageBudgetItem {
  /**
   * A property holding filter values for an array of budget items.
   * @public
   */
  filter = new ItemFilter();

  /**
   * The current open version for the selected budget year.
   * @public
   */
  version!: BudgetVersion;

  /**
   * All budget items for the selected year
   * @public
   */
  budgetItems: BudgetItem[] = [];

  /**
   * Currencies for the current vertsion of the selected year.
   * @public
   */
  currencies: Currency[] = [];

  /**
   * All available budget years.
   * @public
   */
  budgetYears: BudgetYear[] = [];

  /**
   * All available categories.
   * @public
   */
  categories: Category[] = [];

  /**
   * All available categories.
   * @public
   */
  units: Unit[] = [];
}

/**
 * Class representing a budget item.
 */
export class BudgetItem {
  /**
   * Unique identity number for a budget item.
   * @public
   */
  id = -1;

  /**
   * Unique identity number for the current version.
   * @public
   */
  versionId = -1;

  /**
   * Unique identity number for a category item.
   * @public
   */
  categoryId = -1;

  /**
   * Unique identity number for a unit item.
   * @public
   */
  unitId = -1;

  /**
   * The currency of a budget item (3 characters).
   * @public
   * @example EUR
   */
  currencyCode = '';

  /**
   * The value of a budget item.
   * @public
   */
  unitValue = -1;

  /**
   * Notes of the budget expense item.
   * @public
   */
  note = '';

  /**
   * Represent a selected budget item (optional).
   * @public
   * @note Not saved in the database.
   */
  selected?: boolean;

  /**
   * The category name of an actual item (optional).
   * @public
   * @note Not saved in the database.
   */
  categoryName?: string;

  /**
   * The unit name of an actual item (optional).
   * @public
   * @note Not saved in the database.
   */
  unitName?: string;
}
