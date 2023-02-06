import { ActualItem } from '../feature/actual-item/shared/actual-item.model';
import { BudgetItem } from '../feature/budget-item/shared/butget-item.model';
import { BudgetYear, Currency } from '../feature/budget-year/shared/budget-year.model';
import { Budget } from '../feature/budget/shared/budget.model';
import { Category } from '../feature/category/shared/category.model';
import { Trip } from '../feature/trip/shared/trip.model';
import { Unit } from '../feature/unit/shared/unit.model';
import { BudgetVersion } from '../feature/version/shared/budget-version.model';

/**
 * Class representing a fake database server.
 */
export class DatabaseServer {
  dataLoaded = false;
  trips: Trip[] = [];
  categories: Category[] = [];
  units: Unit[] = [];
  budgetYears: BudgetYear[] = [];
  versions: BudgetVersion[] = [];
  currencies: Currency[] = [];
  budgetItems: BudgetItem[] = [];
  actualItems: ActualItem[] = [];
  budgets: Budget[] = [];
}
