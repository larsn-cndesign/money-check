import { ActualItem, CurrencyItem, ManageActualItem } from 'src/app/feature/actual-item/shared/actual-item.model';
import { BudgetYear, Currency, ManageBudgetYear } from 'src/app/feature/budget-year/shared/budget-year.model';
import { Budget } from 'src/app/feature/budget/shared/budget.model';
import { Category } from 'src/app/feature/category/shared/category.model';
import { Trip } from 'src/app/feature/trip/shared/trip.model';
import { Unit } from 'src/app/feature/unit/shared/unit.model';
import { BudgetState } from '../shared/classes/budget-state.model';
import { BudgetVersion } from 'src/app/feature/version/shared/budget-version.model';
import { ItemFilter } from '../shared/classes/filter';

/** Spec Helpers */

export const ACTUAL_ITEM_1 = {
  id: 1,
  amount: 50,
  budgetId: 1,
  categoryId: 1,
  currency: 'EUR',
  note: 'A',
  purchaseDate: new Date('2023-01-01'),
  tripId: 1,
  categoryName: 'Category 1',
  selected: false,
  tripName: 'Trip 1',
} as ActualItem;
export const ACTUAL_ITEM_2 = {
  id: 2,
  amount: 100,
  budgetId: 1,
  categoryId: 1,
  currency: 'SEK',
  note: 'B',
  purchaseDate: new Date('2023-02-01'),
  tripId: 1,
  categoryName: 'Category 2',
  selected: false,
  tripName: 'Trip 2',
} as ActualItem;
export const ACTUAL_ITEMS = [ACTUAL_ITEM_1, ACTUAL_ITEM_2];

export const BUDGET_YEAR_1 = { id: 1, budgetId: 1, year: 2022 } as BudgetYear;
export const BUDGET_YEAR_2 = { id: 2, budgetId: 1, year: 2023 } as BudgetYear;
export const BUDGET_YEARS = [BUDGET_YEAR_1, BUDGET_YEAR_2] as BudgetYear[];

export const CATEGORY_1 = { id: 1, budgetId: 1, categoryName: 'Category 1', selected: false } as Category;
export const CATEGORY_2 = { id: 2, budgetId: 1, categoryName: 'Category 2', selected: false } as Category;
export const CATEGORIES = [CATEGORY_1, CATEGORY_2] as Category[];

export const UNIT_1 = { id: 1, budgetId: 1, unitName: 'Unit 1', useCurrency: true, selected: false } as Unit;
export const UNIT_2 = { id: 2, budgetId: 1, unitName: 'Unit 2', useCurrency: false, selected: false } as Unit;
export const UNITS = [UNIT_1, UNIT_2] as Unit[];

export const TRIP_1 = {
  id: 1,
  budgetId: 1,
  fromDate: new Date('2023-01-01'),
  toDate: new Date('2023-01-10'),
  selected: false,
} as Trip;
export const TRIP_2 = {
  id: 2,
  budgetId: 1,
  fromDate: new Date('2023-01-11'),
  toDate: new Date('2023-01-20'),
  selected: false,
} as Trip;
export const TRIPS = [TRIP_1, TRIP_2] as Trip[];

export const CURRENCY_STRINGS = ['SEK', 'EUR'];

export const FILTER = {
  budgetId: 1,
  versionId: 1,
  budgetYearId: -1,
  categoryId: -1,
  currency: '',
  tripId: -1,
  note: '',
} as ItemFilter;

const CURRENCY_ITEM_SEK = { currency: 'SEK', budgetRate: 1 } as CurrencyItem;
const CURRENCY_ITEM_EUR = { currency: 'EUR', budgetRate: 10 } as CurrencyItem;
export const CURRENCY_ITEMS = [CURRENCY_ITEM_SEK, CURRENCY_ITEM_EUR];

const CURRENCY_1 = { id: 1, versionId: 1, currency: 'SEK', budgetRate: 1, averageRate: 1, selected: false } as Currency;
const CURRENCY_2 = {
  id: 2,
  versionId: 1,
  currency: 'EUR',
  budgetRate: 10,
  averageRate: 10,
  selected: false,
} as Currency;
export const CURRENCIES = [CURRENCY_1, CURRENCY_2];

export const VERSION_1 = {
  id: 1,
  budgetYearId: 1,
  dateCreated: new Date(),
  isClosed: false,
  versionName: 'Version 1',
} as BudgetVersion;
export const VERSION_2 = {
  id: 2,
  budgetYearId: 1,
  dateCreated: new Date(),
  isClosed: false,
  versionName: 'Version 2',
} as BudgetVersion;
export const VERSIONS = [VERSION_1, VERSION_2];

export const MANAGE_ACTUAL_ITEM = new ManageActualItem();
MANAGE_ACTUAL_ITEM.filter = FILTER;
MANAGE_ACTUAL_ITEM.actualItems = ACTUAL_ITEMS;
MANAGE_ACTUAL_ITEM.budgetYears = BUDGET_YEARS;
MANAGE_ACTUAL_ITEM.categories = CATEGORIES;
MANAGE_ACTUAL_ITEM.currencies = CURRENCY_STRINGS;
MANAGE_ACTUAL_ITEM.currencyItems = CURRENCY_ITEMS;
MANAGE_ACTUAL_ITEM.trips = TRIPS;

export const MANAGE_BUDGET_YEAR = new ManageBudgetYear();
MANAGE_BUDGET_YEAR.budgetYears = BUDGET_YEARS;
MANAGE_BUDGET_YEAR.currencies = CURRENCIES;
MANAGE_BUDGET_YEAR.versions = VERSIONS;
MANAGE_BUDGET_YEAR.version = VERSION_1;
MANAGE_BUDGET_YEAR.budgetYear = BUDGET_YEAR_1;

export const BUDGET = { id: 1, budgetName: 'Budget 1', selected: false } as Budget;

export const BUDGET_STATE_VALID = { budgetId: 1, budgetName: 'Budget 1', hasBudget: true, budgets: [] } as BudgetState;
BUDGET_STATE_VALID.budgets = [BUDGET];

export type OmitAllFromStore =
  | 'item$'
  | 'items$'
  | 'item'
  | 'items'
  | 'getUnselectedItems'
  | 'addItem'
  | 'editItem'
  | 'deleteItem'
  | 'updateStore'
  | 'updateStoreItems'
  | 'clearSelection'
  | 'selectItem';
