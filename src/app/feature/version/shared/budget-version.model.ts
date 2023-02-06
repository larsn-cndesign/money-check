/**
 * Interface representing a version of a budget year.
 */
export interface BudgetVersion {
  /**
   * Unique identity number of a version.
   * @public
   */
  id: number;

  /**
   * Unique identity of a budget year.
   * @public
   */
  budgetYearId: number;

  /**
   * The name of the version.
   * Can be anything but is recommended to use version numbering such as 1.0.0.
   * @public
   */
  versionName: string;

  /**
   * The date when the version was created.
   * @public
   */
  dateCreated: Date;

  /**
   * A boolean flag indicating the status of a version.
   * If true the version is closed and can not be modified.
   * @public
   */
  isClosed: boolean;
}
