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

export const MOCK_DATA = {
  dataLoaded: true,
  trips: [],
  categories: [
    { id: 1, budgetId: 1, categoryName: 'Hyra' },
    { id: 2, budgetId: 1, categoryName: 'Mat' },
    { id: 4, budgetId: 1, categoryName: 'Vatten' },
    { id: 5, budgetId: 1, categoryName: 'El' },
    { id: 6, budgetId: 1, categoryName: 'Prenumerationer på nätet' },
  ],
  units: [
    { id: 1, budgetId: 1, unitName: 'Antal per år', useCurrency: false },
    { id: 2, budgetId: 1, unitName: 'Kostnad per månad', useCurrency: true },
    { id: 3, budgetId: 1, unitName: 'Kostnad per kvartal', useCurrency: true },
    { id: 4, budgetId: 1, unitName: 'Kostnad per år', useCurrency: true },
  ],
  budgetYears: [{ id: 1, budgetId: 1, year: 2023 }],
  versions: [{ id: 1, budgetYearId: 1, versionName: 'v1', dateCreated: '2023-03-19T13:59:16.626Z', isClosed: false }],
  currencies: [
    { id: 1, code: 'SEK', versionId: 1, budgetRate: 1, averageRate: 1 },
    { id: 2, code: 'EUR', versionId: 1, budgetRate: 12, averageRate: 11.2 },
  ],
  budgetItems: [
    { id: 1, versionId: 1, categoryId: 1, unitId: 2, currencyCode: 'SEK', unitValue: 5000, note: '' },
    { id: 2, versionId: 1, categoryId: 1, unitId: 1, currencyCode: '', unitValue: 12, note: '' },
    { id: 3, versionId: 1, categoryId: 2, unitId: 2, currencyCode: 'SEK', unitValue: 7000, note: '' },
    { id: 4, versionId: 1, categoryId: 2, unitId: 1, currencyCode: '', unitValue: 12, note: '' },
    { id: 5, versionId: 1, categoryId: 4, unitId: 3, currencyCode: 'SEK', unitValue: 2000, note: '' },
    { id: 6, versionId: 1, categoryId: 4, unitId: 1, currencyCode: '', unitValue: 4, note: '' },
    { id: 7, versionId: 1, categoryId: 5, unitId: 2, currencyCode: 'SEK', unitValue: 10000, note: '' },
    { id: 8, versionId: 1, categoryId: 5, unitId: 1, currencyCode: '', unitValue: 12, note: '' },
    { id: 9, versionId: 1, categoryId: 6, unitId: 4, currencyCode: 'EUR', unitValue: 150, note: '' },
  ],
  actualItems: [
    {
      id: 1,
      budgetId: 1,
      categoryId: 1,
      tripId: -1,
      purchaseDate: '2023-01-30T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 4990,
      note: '',
    },
    {
      id: 2,
      budgetId: 1,
      categoryId: 1,
      tripId: -1,
      purchaseDate: '2023-02-27T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 4990,
      note: '',
    },
    {
      id: 3,
      budgetId: 1,
      categoryId: 2,
      tripId: -1,
      purchaseDate: '2023-01-23T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 7500,
      note: '',
    },
    {
      id: 4,
      budgetId: 1,
      categoryId: 2,
      tripId: -1,
      purchaseDate: '2023-02-15T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 7100,
      note: '',
    },
    {
      id: 5,
      budgetId: 1,
      categoryId: 4,
      tripId: -1,
      purchaseDate: '2023-01-29T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 600,
      note: '',
    },
    {
      id: 6,
      budgetId: 1,
      categoryId: 4,
      tripId: -1,
      purchaseDate: '2023-02-26T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 650,
      note: '',
    },
    {
      id: 7,
      budgetId: 1,
      categoryId: 5,
      tripId: -1,
      purchaseDate: '2023-01-30T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 9000,
      note: '',
    },
    {
      id: 8,
      budgetId: 1,
      categoryId: 5,
      tripId: -1,
      purchaseDate: '2023-02-27T23:00:00.000Z',
      currencyCode: 'SEK',
      amount: 7500,
      note: '',
    },
    {
      id: 9,
      budgetId: 1,
      categoryId: 6,
      tripId: -1,
      purchaseDate: '2023-02-23T23:00:00.000Z',
      currencyCode: 'EUR',
      amount: 147,
      note: '',
    },
  ],
  budgets: [{ id: 1, budgetName: 'Mitt hem' }],
};
