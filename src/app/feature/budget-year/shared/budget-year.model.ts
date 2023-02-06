import { Selectable } from 'src/app/shared/interfaces/selectable';
import { BudgetVersion } from '../../version/shared/budget-version.model';

/**
 * Class representing a wrapper for a budget year.
 */
export class ManageBudgetYear {
  /**
   * A boolean flag that indicates if teh previous version should be copied or not.
   * @public
   * @default false Dont copy previous version.
   */
  copy = false;

  /**
   * A budget year object.
   * @public
   */
  budgetYear!: BudgetYear;

  /**
   * A version object of a budget year.
   * @public
   */
  version!: BudgetVersion;

  /**
   * An array of currency objects of a budget year.
   * @public
   * @default Currency[] An empty array of currency objects.
   */
  currencies: Currency[] = [];

  /**
   * An array of version objects of a budget year.
   * @public
   * @default Currency[] An empty array of version objects.
   */
  versions: BudgetVersion[] = [];

  /**
   * A property holding an array of budget years.
   * @public
   * @default BudgetYear[] An empty array of budget years.
   */
  budgetYears: BudgetYear[] = [];
}

/**
 * Interface representing a budget year.
 */
export interface BudgetYear {
  /**
   * Unique identity number of a budget year.
   * @public
   */
  id: number;

  /**
   * Unique identity number of a budget.
   * @public
   */
  budgetId: number;

  /**
   * A year of a budget.
   * @public
   */
  year: number;
}

/**
 * Interface representing a currency item.
 * @extends Selectable
 */
export interface Currency extends Selectable {
  /**
   * Unique identity number for a currency.
   * @public
   */
  id: number;

  /**
   * Unique identity number for a version.
   * @public
   */
  versionId: number;

  /**
   * The name of a currency.
   * @public
   */
  currency: string;

  /**
   * The budget rate of the selected currency for the current version of the selected year(s).
   * @public
   */
  budgetRate: number;

  /**
   * The average budget rate of the selected currency for the current version of the selected year(s).
   * @public
   */
  averageRate: number;
}
