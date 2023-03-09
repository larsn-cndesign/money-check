import { ItemFilter } from 'src/app/shared/classes/filter';
import { BudgetYear, Currency } from '../../budget-year/shared/budget-year.model';
import { Category } from '../../category/shared/category.model';
import { BudgetVersion } from '../../version/shared/budget-version.model';

/**
 * Class representing budget varaince.
 */
export class BudgetVariance {
  /**
   * Hold filter settings.
   * @public
   * @default new ItemFilter() Initializes an `ItemFilter` object.
   */
  filter = new ItemFilter();

  /**
   * Hold a budget version.
   * @public
   */
  version!: BudgetVersion;

  /**
   * Hold a currency item.
   * @public
   */
  currency!: Currency;

  // /**
  //  * Hold a category item.
  //  * @public
  //  */
  // category!: Category;

  /**
   * Hold a varaiance item.
   * @public
   * @default new VarianceItem() Initializes an `VarianceItem` object.
   */
  varianceItem = new VarianceItem();

  /**
   * Holds all years within a budget.
   * @public
   * @default BudgetYear[] An empty array of budget years.
   */
  budgetYears: BudgetYear[] = [];

  /**
   * Hold all versions of a budget year (@default []).
   * @public
   */
  versions: BudgetVersion[] = [];

  /**
   * Hold all categories (@default []).
   * @public
   */
  categories: Category[] = [];

  /**
   * Hold all currencies of a version (@default []).
   * @public
   */
  currencies: Currency[] = [];

  /**
   * Hold all variance items for all categories (@default []).
   * @public
   */
  varianceItems: VarianceItem[] = [];
}

export class VarianceItem {
  /**
   * The name of a category (@default '').
   * @public
   */
  category = '';

  /**
   * The budget expense amount (@default 0).
   * @public
   */
  budget = 0;

  /**
   * The actual expense amount (@default 0).
   * @public
   */
  actual = 0;

  /**
   * The varaince amount (@default 0).
   * @note The varaince amount is calculated as budget - actals.
   * @public
   */
  variance = 0;

  /**
   * A boolean flag to indicate if an item is selected (optional).
   * @public
   */
  selected?: boolean;
}
