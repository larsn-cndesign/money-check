import { ActualItem, CurrencyItem, ManageActualItem } from 'src/app/feature/actual-item/shared/actual-item.model';
import { BudgetYear, Currency, ManageBudgetYear } from 'src/app/feature/budget-year/shared/budget-year.model';
import { Budget } from 'src/app/feature/budget/shared/budget.model';
import { Category } from 'src/app/feature/category/shared/category.model';
import { Trip } from 'src/app/feature/trip/shared/trip.model';
import { Unit } from 'src/app/feature/unit/shared/unit.model';
import { BudgetState } from '../shared/classes/budget-state.model';
import { BudgetVersion } from 'src/app/feature/version/shared/budget-version.model';
import { ItemFilter } from '../shared/classes/filter';
import { deepCoyp } from '../shared/classes/common.fn';

/** Spec Helpers, DO NOT CHANGE! */

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

// Cannot use deepCopy function as it will stringify Date object
export function deepCopyActualItem(item: ActualItem): ActualItem {
  return {
    id: item.id,
    amount: item.amount,
    budgetId: item.budgetId,
    categoryId: item.categoryId,
    currency: item.currency,
    note: item.note,
    purchaseDate: item.purchaseDate,
    tripId: item.tripId,
    categoryName: item.categoryName,
    selected: item.selected,
    tripName: item.tripName,
  } as ActualItem;
}

// Can not use deepCopy on Date
export const ACTUAL_ITEMS = [deepCopyActualItem(ACTUAL_ITEM_1), deepCopyActualItem(ACTUAL_ITEM_2)];

export const BUDGET_YEAR_1 = { id: 1, budgetId: 1, year: 2022 } as BudgetYear;
export const BUDGET_YEAR_2 = { id: 2, budgetId: 1, year: 2023 } as BudgetYear;
export const BUDGET_YEARS = [deepCoyp(BUDGET_YEAR_1), deepCoyp(BUDGET_YEAR_2)] as BudgetYear[];

export const CATEGORY_1 = { id: 1, budgetId: 1, categoryName: 'Category 1', selected: false } as Category;
export const CATEGORY_2 = { id: 2, budgetId: 1, categoryName: 'Category 2', selected: false } as Category;
export const CATEGORIES = [deepCoyp(CATEGORY_1), deepCoyp(CATEGORY_2)] as Category[];

export const UNIT_1 = { id: 1, budgetId: 1, unitName: 'Unit 1', useCurrency: true, selected: false } as Unit;
export const UNIT_2 = { id: 2, budgetId: 1, unitName: 'Unit 2', useCurrency: false, selected: false } as Unit;
export const UNITS = [deepCoyp(UNIT_1), deepCoyp(UNIT_2)] as Unit[];

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

// Cannot use deepCopy function as it will stringify Date object
export function deepCopyTrip(item: Trip): Trip {
  return {
    id: item.id,
    budgetId: item.budgetId,
    fromDate: item.fromDate,
    toDate: item.toDate,
    selected: item.selected,
  } as Trip;
}

export const TRIPS = [deepCopyTrip(TRIP_1), deepCopyTrip(TRIP_2)] as Trip[];

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
export const CURRENCY_ITEMS = [deepCoyp(CURRENCY_ITEM_SEK), deepCoyp(CURRENCY_ITEM_EUR)];

const CURRENCY_1 = { id: 1, versionId: 1, currency: 'SEK', budgetRate: 1, averageRate: 1, selected: false } as Currency;
const CURRENCY_2 = {
  id: 2,
  versionId: 1,
  currency: 'EUR',
  budgetRate: 10,
  averageRate: 10,
  selected: false,
} as Currency;
export const CURRENCIES = [deepCoyp(CURRENCY_1), deepCoyp(CURRENCY_2)];

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

// Cannot use deepCopy function as it will stringify Date object
export function deepCopyVersion(item: BudgetVersion): BudgetVersion {
  return {
    id: item.id,
    budgetYearId: item.budgetYearId,
    dateCreated: item.dateCreated,
    isClosed: item.isClosed,
    versionName: item.versionName,
  } as BudgetVersion;
}

export const VERSIONS = [deepCopyVersion(VERSION_1), deepCopyVersion(VERSION_2)];

// Cannot use deepCopy function as it will stringify Date object
export function deepCopyManageActualItem(item: ManageActualItem): ManageActualItem {
  return {
    filter: item.filter,
    actualItems: item.actualItems,
    budgetYears: item.budgetYears,
    categories: item.categories,
    currencies: item.currencies,
    currencyItems: item.currencyItems,
    trips: item.trips,
  } as ManageActualItem;
}

export const MANAGE_ACTUAL_ITEM = {
  filter: FILTER,
  actualItems: ACTUAL_ITEMS,
  budgetYears: BUDGET_YEARS,
  categories: CATEGORIES,
  currencies: CURRENCY_STRINGS,
  currencyItems: CURRENCY_ITEMS,
  trips: TRIPS,
} as ManageActualItem;
// MANAGE_ACTUAL_ITEM.filter = FILTER;
// MANAGE_ACTUAL_ITEM.actualItems = ACTUAL_ITEMS;
// MANAGE_ACTUAL_ITEM.budgetYears = BUDGET_YEARS;
// MANAGE_ACTUAL_ITEM.categories = CATEGORIES;
// MANAGE_ACTUAL_ITEM.currencies = CURRENCY_STRINGS;
// MANAGE_ACTUAL_ITEM.currencyItems = CURRENCY_ITEMS;
// MANAGE_ACTUAL_ITEM.trips = TRIPS;

export const MANAGE_BUDGET_YEAR = new ManageBudgetYear();
MANAGE_BUDGET_YEAR.budgetYears = BUDGET_YEARS;
MANAGE_BUDGET_YEAR.currencies = CURRENCIES;
MANAGE_BUDGET_YEAR.versions = VERSIONS;
MANAGE_BUDGET_YEAR.version = VERSION_1;
MANAGE_BUDGET_YEAR.budgetYear = BUDGET_YEAR_1;

export const BUDGET = { id: 1, budgetName: 'Budget 1', selected: false } as Budget;

export const BUDGET_STATE = { budgetId: 1, budgetName: 'Budget 1', hasBudget: true, budgets: [] } as BudgetState;
BUDGET_STATE.budgets = [deepCoyp(BUDGET)];

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
