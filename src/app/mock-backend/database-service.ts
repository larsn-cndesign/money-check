import { ActualItem, CurrencyItem, ManageActualItem } from '../feature/actual-item/shared/actual-item.model';
import { BudgetItem, ManageBudgetItem } from '../feature/budget-item/shared/butget-item.model';
import { BudgetVariance, VarianceItem } from '../feature/budget-variance/shared/budget-variance.model';
import { ManageBudgetYear, Currency, BudgetYear } from '../feature/budget-year/shared/budget-year.model';
import { Budget } from '../feature/budget/shared/budget.model';
import { Category } from '../feature/category/shared/category.model';
import { Trip } from '../feature/trip/shared/trip.model';
import { Unit } from '../feature/unit/shared/unit.model';
import { BudgetVersion } from '../feature/version/shared/budget-version.model';
import { BudgetState } from '../shared/classes/budget-state.model';
import { toDate } from '../shared/classes/common.fn';
import { ItemFilter } from '../shared/classes/filter';
import { Selectable } from '../shared/interfaces/selectable';
import { DatabaseServer } from './mock-database';

interface PrimaryKey {
  id: number;
}

/**
 * Class representing a service for CRUD operations on a fake database server.
 * @description Only used for testing and should be replaced with backend code.
 * The code is not optimized and basic constraints is simulated but many of them are missing.
 * None of the methods in this class is documented with JSDoc.
 */
export class DatabaseService {
  private static db = new DatabaseServer();

  static writeToDatabase(): void {
    localStorage.setItem('db', JSON.stringify(this.db));
  }

  static readFromDatabase(): void {
    const dbStore = localStorage.getItem('db');
    const db = new DatabaseServer();
    if (dbStore) {
      const dbServer = JSON.parse(dbStore) as DatabaseServer;
      db.dataLoaded = true;
      db.categories = dbServer.categories ?? [];
      db.currencies = dbServer.currencies ?? [];
      db.trips = dbServer.trips ?? [];
      db.units = dbServer.units ?? [];
      db.versions = dbServer.versions ?? [];
      db.budgetYears = dbServer.budgetYears ?? [];
      db.budgetItems = dbServer.budgetItems ?? [];
      db.actualItems = dbServer.actualItems ?? [];
      db.budgets = dbServer.budgets ?? [];
    }

    this.db = db;
  }

  // ------------------------------------
  // Budget
  // ------------------------------------

  static getBudgets(): Budget[] {
    this.readFromDatabase();
    return this._addItemsSelectedProperty(this.db.budgets);
  }

  static addBudget(item: Budget): Budget {
    this.readFromDatabase();

    const budget: Budget = { id: this._incrementId(this.db.budgets), budgetName: item.budgetName };
    this.db.budgets.push(budget);

    this.writeToDatabase();

    return this._addItemSelectedProperty(budget);
  }

  static editBudget(item: Budget): Budget {
    this.readFromDatabase();

    const budget = this.db.budgets.find((x) => x.id === item.id);
    if (budget) {
      budget.budgetName = item.budgetName;
      this.writeToDatabase();
    }

    return this._addItemSelectedProperty(item);
  }

  // ------------------------------------
  // Categories
  // ------------------------------------

  static getCategories(budgetId: number): Category[] {
    this.readFromDatabase();
    return this._addItemsSelectedProperty(this.db.categories.filter((x) => x.budgetId === budgetId));
  }

  static addCategory(item: Category): Category {
    this.readFromDatabase();

    const category: Category = {
      id: this._incrementId(this.db.categories),
      budgetId: item.budgetId,
      categoryName: item.categoryName,
    };
    this.db.categories.push(category);

    this.writeToDatabase();

    return this._addItemSelectedProperty(category);
  }

  static editCategory(item: Category): Category {
    this.readFromDatabase();

    const category = this.db.categories.find((x) => x.id === item.id);
    if (category) {
      category.categoryName = item.categoryName;
      this.writeToDatabase();
    }

    return this._addItemSelectedProperty(item);
  }

  static deleteCategory(item: Category): Category {
    this.readFromDatabase();

    const budgetItemIndex = this.db.budgetItems.findIndex((x) => x.categoryId === item.id);
    if (budgetItemIndex !== -1) {
      throw new Error('Denna kategori använs i någon budget och kan därför inte tas bort.');
    }

    const actualItemIndex = this.db.actualItems.findIndex((x) => x.categoryId === item.id);
    if (actualItemIndex !== -1) {
      throw new Error('Denna kategori använs i någon transaktion och kan därför inte tas bort.');
    }

    this.db.categories = this._deleteItem(this.db.categories, item);

    this.writeToDatabase();

    return this._addItemSelectedProperty(item);
  }

  // ------------------------------------
  // Units
  // ------------------------------------
  static getUnits(budgetId: number): Unit[] {
    this.readFromDatabase();
    return this._addItemsSelectedProperty(this.db.units.filter((x) => x.budgetId === budgetId));
  }

  static addUnit(item: Unit): Unit {
    this.readFromDatabase();

    const unit: Unit = {
      id: this._incrementId(this.db.units),
      budgetId: item.budgetId,
      unitName: item.unitName,
      useCurrency: item.useCurrency,
    };
    this.db.units.push(unit);

    this.writeToDatabase();

    return this._addItemSelectedProperty(unit);
  }

  static editUnit(item: Unit): Unit {
    this.readFromDatabase();

    const unit = this.db.units.find((x) => x.id === item.id);
    if (unit) {
      unit.unitName = item.unitName;
      unit.useCurrency = item.useCurrency;
      this.writeToDatabase();
    }

    return this._addItemSelectedProperty(item);
  }

  static deleteUnit(item: Unit): Unit {
    this.readFromDatabase();

    const budgetItemIndex = this.db.budgetItems.findIndex((x) => x.unitId === item.id);
    if (budgetItemIndex !== -1) {
      throw new Error('Denna enhet använs i någon budget och kan därför inte tas bort.');
    }

    this.db.units = this._deleteItem(this.db.units, item);

    this.writeToDatabase();

    return this._addItemSelectedProperty(item);
  }

  // ------------------------------------
  // Trips
  // ------------------------------------
  static getTrips(budgetId: number): Trip[] {
    this.readFromDatabase();
    return this._addItemsSelectedProperty(this.db.trips.filter((x) => x.budgetId === budgetId));
  }

  static addTrip(item: Trip): Trip {
    this.readFromDatabase();

    const trip: Trip = {
      id: this._incrementId(this.db.trips),
      budgetId: item.budgetId,
      fromDate: item.fromDate,
      toDate: item.toDate,
    };
    this.db.trips.push(trip);

    this.writeToDatabase();

    return this._addItemSelectedProperty(trip);
  }

  static editTrip(item: Trip): Trip {
    this.readFromDatabase();

    const trip = this.db.trips.find((x) => x.id === item.id);
    if (trip) {
      trip.fromDate = item.fromDate;
      trip.toDate = item.toDate;
      this.writeToDatabase();
    }

    return this._addItemSelectedProperty(item);
  }

  static deleteTrip(item: Trip): Trip {
    this.readFromDatabase();

    const actualItemIndex = this.db.actualItems.findIndex((x) => x.tripId === item.id);
    if (actualItemIndex !== -1) {
      throw new Error('Denna resa använs i någon transaktion och kan därför inte tas bort.');
    }

    this.db.trips = this._deleteItem(this.db.trips, item);

    this.writeToDatabase();

    return this._addItemSelectedProperty(item);
  }

  // ------------------------------------
  // ManageBudgetYear
  // ------------------------------------

  static getBudgetYear(budgetId: number): ManageBudgetYear {
    this.readFromDatabase();

    const budgetYear = new ManageBudgetYear();
    budgetYear.budgetYears = this.db.budgetYears.filter((x) => x.budgetId === budgetId);
    budgetYear.copy = budgetYear.budgetYears.length > 0;

    return budgetYear;
  }

  static createBudgetYear(item: ManageBudgetYear): void {
    this.readFromDatabase();

    // Add year
    const budgetYear: BudgetYear = {
      id: this._incrementId(this.db.budgetYears),
      budgetId: item.budgetYear.budgetId,
      year: item.budgetYear.year,
    };
    this.db.budgetYears.push(budgetYear);

    const currentVersionId = Math.max(...this.db.versions.map((v) => v.id));
    const newVersionId = this._incrementId(this.db.versions);

    // Copy currencies and budget items from latest version
    if (item.copy) {
      item.currencies = [...this._versionCurrencies(currentVersionId)];
      this._addBudgetItems(currentVersionId, newVersionId);
    }

    this._addVersion(budgetYear.id, newVersionId);
    this._addCurrencies(item.currencies, newVersionId);

    this.writeToDatabase();
  }

  static deleteBudgetYear(budgetYear: BudgetYear): void {
    this.readFromDatabase();

    // For simplicity, keep not deleted items instead of deleting them
    const budgetYears: BudgetYear[] = [...this.db.budgetYears.filter((x) => x.id !== budgetYear.id)];
    const versions: BudgetVersion[] = [...this.db.versions.filter((x) => x.budgetYearId !== budgetYear.id)];
    let budgetItems: BudgetItem[] = [];
    let currencies: Currency[] = [];

    this.db.currencies.forEach((currency) => {
      const found = versions.find((x) => x.id === currency.versionId);
      if (found) {
        currencies = [...currencies, currency];
      }
    });

    this.db.budgetItems.forEach((budgetItem) => {
      const found = versions.find((x) => x.id === budgetItem.versionId);
      if (found) {
        budgetItems = [...budgetItems, budgetItem];
      }
    });

    this.db.budgetItems = budgetItems;
    this.db.currencies = currencies;
    this.db.versions = versions;
    this.db.budgetYears = budgetYears;

    this.writeToDatabase();
  }

  // ------------------------------------
  // Version
  // ------------------------------------

  static createVersion(item: ManageBudgetYear): void {
    this.readFromDatabase();

    const currentVersion = this._currentVersion(item.budgetYear.id);
    const newVersionId = this._incrementId(this.db.versions);

    // Close previous version
    if (currentVersion) {
      currentVersion.isClosed = true;
    }

    this._addVersion(item.budgetYear.id, newVersionId);

    this._addCurrencies(item.currencies, newVersionId);

    if (item.copy && currentVersion) {
      this._addBudgetItems(currentVersion.id, newVersionId);
    }

    this.writeToDatabase();
  }

  static getCurrentVersion(budgetYear: BudgetYear): ManageBudgetYear {
    this.readFromDatabase();

    const item = new ManageBudgetYear();
    item.budgetYear = budgetYear;
    item.budgetYears = this.db.budgetYears.filter((x) => x.budgetId === budgetYear.budgetId);
    item.versions = this.db.versions.filter((x) => x.budgetYearId === budgetYear.id);

    const currentVersion = this._currentVersion(budgetYear.id);
    if (currentVersion) {
      const currencies = this._versionCurrencies(currentVersion.id);
      item.version = currentVersion;
      item.currencies = currencies;
    }

    return item;
  }

  static deleteVersion(item: ManageBudgetYear): void {
    this.readFromDatabase();

    // Reopen latest closed version
    const closedVersions = this.db.versions.filter((x) => x.budgetYearId === item.budgetYear.id && x.isClosed);
    const lastClosedVersion = closedVersions.reduce((prev, current) => (prev.id > current.id ? prev : current));
    lastClosedVersion.isClosed = false;

    const versionIndex = this.db.versions.findIndex((x) => x.id === item.version.id);

    // For simplicity, keep not deleted items instead of deleting them
    let currencies: Currency[] = [];
    this.db.currencies.forEach((currency) => {
      if (currency.versionId !== this.db.versions[versionIndex].id) {
        currencies = [...currencies, currency];
      }
    });

    let budgetItems: BudgetItem[] = [];
    this.db.budgetItems.forEach((budgetItem) => {
      if (budgetItem.versionId !== this.db.versions[versionIndex].id) {
        budgetItems = [...budgetItems, budgetItem];
      }
    });

    this.db.budgetItems = budgetItems;
    this.db.currencies = currencies;
    this.db.versions = this._deleteItem(this.db.versions, this.db.versions[versionIndex]);

    this.writeToDatabase();
  }

  static updateVersion(item: ManageBudgetYear): void {
    this.readFromDatabase();

    const version = this.db.versions.find((x) => x.id === item.version.id);
    if (version) {
      version.versionName = item.version.versionName;
      const dbCurrencies = this._removeItemsSelectedProperty(item.currencies);

      const otherCurrencies = this.db.currencies.filter((x) => x.versionId !== version.id);
      const currencies = [...otherCurrencies, ...dbCurrencies];
      this.db.currencies = currencies;
    }

    this.writeToDatabase();
  }

  // ------------------------------------
  // Budget item
  // ------------------------------------

  static getBudgetItems(filter: ItemFilter): ManageBudgetItem {
    this.readFromDatabase();

    const item = new ManageBudgetItem();

    if (filter.budgetYearId === -1) {
      item.filter.budgetYearId = Math.max(...this.db.budgetYears.map((n) => n.id)); // Get latest year
    } else {
      const selectedBudgetYear = this.db.budgetYears.find((x) => x.id === filter.budgetYearId);
      item.filter.budgetYearId = selectedBudgetYear?.id ?? -1;
    }

    // Get current version
    const currentVersion = this._currentVersion(item.filter.budgetYearId);
    if (currentVersion) {
      item.version = currentVersion;
      item.currencies = this._versionCurrencies(currentVersion.id);
      item.budgetItems = this._budgetItemsWithOptionalProps(currentVersion.id);

      if (filter.categoryId !== -1) {
        item.budgetItems = [...item.budgetItems.filter((x) => x.categoryId === filter.categoryId)];
      }
    }

    item.filter = filter;
    item.budgetYears = this.db.budgetYears.filter((x) => x.budgetId === filter.budgetId);
    item.categories = this.db.categories.filter((x) => x.budgetId === filter.budgetId);
    item.units = this.db.units.filter((x) => x.budgetId === filter.budgetId);

    return item;
  }

  static addBudgetItem(item: BudgetItem): BudgetItem {
    this.readFromDatabase();

    const budgetItem = this._createBudgetItem(item, item.versionId);
    this.db.budgetItems.push(budgetItem);

    this.writeToDatabase();

    return this._budgetItemWithOptionalProps(budgetItem);
  }

  static editBudgetItem(item: BudgetItem): BudgetItem {
    this.readFromDatabase();

    const budgetItem = this.db.budgetItems.find((x) => x.id === item.id);
    if (budgetItem) {
      budgetItem.versionId = item.versionId;
      budgetItem.categoryId = item.categoryId;
      budgetItem.unitId = item.unitId;
      budgetItem.currency = item.currency;
      budgetItem.unitValue = item.unitValue;
      budgetItem.note = item.note;
    }

    this.writeToDatabase();

    return this._budgetItemWithOptionalProps(item);
  }

  static deleteBudgetItem(item: BudgetItem): BudgetItem {
    this.readFromDatabase();

    this.db.budgetItems = this._deleteItem(this.db.budgetItems, item);

    this.writeToDatabase();

    return this._budgetItemWithOptionalProps(item);
  }

  // ------------------------------------
  // Actual item
  // ------------------------------------

  static getActualItems(filter: ItemFilter): ManageActualItem {
    this.readFromDatabase();

    const item = new ManageActualItem();

    const currencyItems: CurrencyItem[] = [];
    let currencies: string[] = [];
    let actualItems: ActualItem[] = [];

    const years = this._selectBudgetYears(filter.budgetId, filter.budgetYearId);

    // Get open currencies and transactions for selected years
    years.forEach((budgetYear) => {
      const currentVersion = this._currentVersion(budgetYear.id);

      // Get currencies per year
      if (currentVersion) {
        this.db.currencies.forEach((c) => {
          if (c.versionId === currentVersion.id) {
            currencyItems.push({ currency: c.code, budgetRate: c.budgetRate } as CurrencyItem);
          }
        });
      }

      // Transactions
      const transactions = this.db.actualItems.filter(
        (x) => x.budgetId === filter.budgetId && new Date(toDate(x.purchaseDate)).getFullYear() === budgetYear.year
      );
      actualItems = [...actualItems, ...transactions];
    });

    // Get uniqe currencies for selected period
    currencies = Array.from(new Set(currencyItems.map((currencyItem) => currencyItem.currency)));

    // Filter transactions
    if (filter.currency !== '') {
      actualItems = [...actualItems.filter((x) => x.currency === filter.currency)];
    }
    if (filter.categoryId !== -1) {
      actualItems = [...actualItems.filter((x) => x.categoryId === filter.categoryId)];
    }
    if (filter.tripId !== -1) {
      actualItems = [...actualItems.filter((x) => x.tripId === filter.tripId)];
    }
    if (filter.note !== '') {
      actualItems = [...actualItems.filter((x) => x.note && x.note.toLowerCase().includes(filter.note.toLowerCase()))];
    }

    item.filter = filter;
    item.budgetYears = years;
    item.currencies = currencies;
    item.actualItems = this._actualItemsWithOptionalProps(actualItems);
    item.categories = this.db.categories.filter((x) => x.budgetId === filter.budgetId);
    item.trips = this.db.trips.filter((x) => x.budgetId === filter.budgetId);
    item.currencyItems = currencyItems;

    return item;
  }

  static addActualItem(item: ActualItem): ActualItem {
    this.readFromDatabase();

    const actualItem = this._createActualItem(item);
    this.db.actualItems.push(actualItem);

    this.writeToDatabase();

    return this._actualItemWithOptionalProps(actualItem);
  }

  static editActualItem(item: ActualItem): ActualItem {
    this.readFromDatabase();

    const actualItem = this.db.actualItems.find((x) => x.id === item.id);
    if (actualItem) {
      actualItem.categoryId = item.categoryId;
      actualItem.tripId = item.tripId;
      actualItem.purchaseDate = item.purchaseDate;
      actualItem.currency = item.currency;
      actualItem.amount = item.amount;
      actualItem.note = item.note;
    }

    this.writeToDatabase();

    return this._actualItemWithOptionalProps(item);
  }

  static deleteActualItem(item: ActualItem): ActualItem {
    this.readFromDatabase();

    this.db.actualItems = this._deleteItem(this.db.actualItems, item);

    this.writeToDatabase();

    return this._actualItemWithOptionalProps(item);
  }

  // ------------------------------------
  // Budget variance
  // ------------------------------------

  static loadVariancePage(budgetId: number): BudgetVariance {
    this.readFromDatabase();

    const filter = new ItemFilter();
    filter.budgetId = budgetId;

    return this.getVarianceItems(filter);
  }

  static getVarianceItems(filter: ItemFilter): BudgetVariance {
    this.readFromDatabase();

    const item = new BudgetVariance();

    // Year
    item.budgetYears = this.db.budgetYears.filter((x) => x.budgetId === filter.budgetId);
    filter.budgetYearId =
      filter.budgetYearId === -1 ? Math.max(...item.budgetYears.map((n) => n.id)) : filter.budgetYearId;

    const budgetYear = item.budgetYears.find((x) => x.id === filter.budgetYearId);
    if (!budgetYear) {
      return new BudgetVariance(); // There is no budget years for the budget.
    }

    // Version
    item.versions = this.db.versions.filter((x) => x.budgetYearId === filter.budgetYearId);
    let version;
    if (filter.versionId === -1) {
      version = this._currentVersion(filter.budgetYearId);
    } else {
      version = item.versions.find((x) => x.id === filter.versionId);
    }

    if (version) {
      item.version = version;
      filter.versionId = version.id;

      // Currency
      item.currencies = this._versionCurrencies(version.id);
      const currency = item.currencies.find((x) => x.code === filter.currency);
      item.currency = filter.currency !== '' && currency ? currency : item.currencies[0];
      filter.currency = item.currency.code;

      // Other
      item.categories = this.db.categories;
      // item.category = { id: -1, budgetId: -1, categoryName: '' };

      // Sum category
      const varianceItems: VarianceItem[] = [];
      this.db.categories
        .filter((x) => x.budgetId === filter.budgetId)
        .forEach((category) => {
          const varianceItem = new VarianceItem();

          // Sum actual items
          const sumActual = this.db.actualItems
            .filter((x) => x.categoryId === category.id && new Date(x.purchaseDate).getFullYear() === budgetYear.year)
            .reduce((sum, current) => {
              return sum + this._sumCurrency(current.amount, current.currency, item.currency, item.currencies);
            }, 0);
          varianceItem.actual = isNaN(sumActual) ? 0 : sumActual;

          // Sum budget items
          const sumBudget = this.db.budgetItems
            .filter((x) => x.categoryId === category.id && x.versionId === item.version.id)
            .reduce((sum, current) => {
              return sum * this._sumCurrency(current.unitValue, current.currency, item.currency, item.currencies);
            }, 1);
          varianceItem.budget = sumBudget === 1 || isNaN(sumBudget) ? 0 : sumBudget;
          varianceItem.variance = varianceItem.budget - varianceItem.actual;

          varianceItem.category = category.categoryName;
          varianceItems.push(varianceItem);
        });
      item.varianceItems = varianceItems;

      // Calculate totals
      const totalActual = varianceItems.reduce((sum, a) => sum + a.actual, 0);
      const totalBudget = varianceItems.reduce((sum, b) => sum + b.budget, 0);
      item.varianceItem.actual = totalActual;
      item.varianceItem.budget = totalBudget;
      item.varianceItem.variance = totalBudget - totalActual;

      item.filter = filter;
    }

    return item;
  }

  // ------------------------------------
  // Budget sate
  // ------------------------------------

  static getBudgetState(): BudgetState {
    this.readFromDatabase();

    const budgetSate = new BudgetState();

    budgetSate.budgets = this.db.budgets;
    budgetSate.budgetId = this.db.budgets.length > 0 ? this.db.budgets[0].id : -1;
    budgetSate.hasBudget = this.db.budgets.length > 0;

    return budgetSate;
  }

  // ------------------------------------
  // Fake database helper methods
  // ------------------------------------

  private static _sumCurrency(val: number, currency: string, selCurrency: Currency, currencies: Currency[]): number {
    let total = 0;

    if (!selCurrency.code || currency === '' || currency === selCurrency.code) {
      total = val;
    } else {
      const converCurrency = currencies.find((curr) => curr.code === currency);
      if (converCurrency) {
        total = val * (converCurrency.budgetRate / selCurrency.budgetRate);
      } else {
        total = val;
      }
    }

    return total;
  }

  private static _incrementId<T extends PrimaryKey>(array: T[]): number {
    return array.length > 0 ? Math.max(...array.map((i) => i.id)) + 1 : 1;
  }

  private static _deleteItem<T extends PrimaryKey>(array: T[], item: T): T[] {
    const index = array.findIndex((x) => x.id === item.id);
    if (index !== -1) {
      array.splice(index, 1);
    }

    return array;
  }

  private static _addItemsSelectedProperty<T extends Selectable>(array: T[]): T[] {
    array.forEach((item) => {
      item.selected = false;
    });

    return array;
  }

  private static _addItemSelectedProperty<T extends Selectable>(item: T): T {
    item.selected = false;

    return item;
  }

  private static _removeItemsSelectedProperty<T extends Selectable>(array: T[]): T[] {
    array.forEach((item) => {
      delete item.selected;
    });

    return array;
  }

  /**
   * @param budgetYearId The budget year to add the new version to.
   * @param versionId The auto incremented id for the new version.
   */
  private static _addVersion(budgetYearId: number, versionId: number): void {
    const yearVersions = this.db.versions.filter((x) => x.budgetYearId === budgetYearId);
    // Create version object
    const version: BudgetVersion = {
      id: versionId,
      budgetYearId,
      versionName: 'v' + this._incrementId(yearVersions),
      dateCreated: new Date(),
      isClosed: false,
    };

    this.db.versions.push(version);
  }

  /**
   * @param currencies Array of currencies to copy from
   * @param versionId The version number to use for the new currency items
   */
  private static _addCurrencies(currencies: Currency[], versionId: number): void {
    currencies.forEach((item) => {
      // Create currency object
      const currency: Currency = {
        id: this._incrementId(this.db.currencies),
        code: item.code,
        versionId,
        budgetRate: item.budgetRate,
        averageRate: item.averageRate,
      };

      this.db.currencies.push(currency);
    });
  }

  /**
   * @param oldVersionId Version number to copy budget items from
   * @param newVersionId Version number to add budget items to
   */
  private static _addBudgetItems(oldVersionId: number, newVersionId: number): void {
    this.db.budgetItems.forEach((item) => {
      if (item.versionId === oldVersionId) {
        const budgetItem = this._createBudgetItem(item, newVersionId);
        this.db.budgetItems.push(budgetItem);
      }
    });
  }

  private static _createBudgetItem(item: BudgetItem, versionId: number): BudgetItem {
    return {
      id: this._incrementId(this.db.budgetItems),
      versionId,
      categoryId: item.categoryId,
      unitId: item.unitId,
      currency: item.currency,
      unitValue: item.unitValue,
      note: item.note,
    } as BudgetItem;
  }

  private static _budgetItemWithOptionalProps(item: BudgetItem): BudgetItem {
    item.selected = false;
    item.categoryName = this.db.categories.find((x) => x.id === item.categoryId)?.categoryName;
    item.unitName = this.db.units.find((x) => x.id === item.unitId)?.unitName;

    return item;
  }

  private static _budgetItemsWithOptionalProps(versionId: number): BudgetItem[] {
    const items = this.db.budgetItems.filter((x) => x.versionId === versionId);
    items.forEach((item) => {
      item.selected = false;
      item.categoryName = this.db.categories.find((x) => x.id === item.categoryId)?.categoryName;
      item.unitName = this.db.units.find((x) => x.id === item.unitId)?.unitName;
    });

    return items;
  }

  private static _createActualItem(item: ActualItem): ActualItem {
    return {
      id: this._incrementId(this.db.actualItems),
      budgetId: item.budgetId,
      categoryId: item.categoryId,
      tripId: item.tripId,
      purchaseDate: item.purchaseDate,
      currency: item.currency,
      amount: item.amount,
      note: item.note,
    } as ActualItem;
  }

  private static _actualItemWithOptionalProps(item: ActualItem): ActualItem {
    item.selected = false;
    item.categoryName = this.db.categories.find((x) => x.id === item.categoryId)?.categoryName;
    const trip = this.db.trips.find((x) => x.id === item.tripId);
    item.tripName = trip ? toDate(trip.fromDate) + ' / ' + toDate(trip.toDate) : '-';

    return item;
  }

  private static _actualItemsWithOptionalProps(actualItems: ActualItem[]): ActualItem[] {
    actualItems.forEach((item) => {
      item = this._actualItemWithOptionalProps(item);
    });

    return actualItems;
  }

  private static _currentVersion(budgetYearId: number): BudgetVersion | undefined {
    return this.db.versions.find((x) => x.budgetYearId === budgetYearId && !x.isClosed);
  }

  private static _versionCurrencies(versionId: number): Currency[] {
    return this.db.currencies.filter((x) => x.versionId === versionId);
  }

  private static _selectBudgetYears(budgetId: number, budgetYearId: number): BudgetYear[] {
    const budgetYears = this.db.budgetYears.filter((x) => x.budgetId === budgetId);
    return budgetYearId === -1 ? budgetYears : budgetYears.filter((x) => x.id === budgetYearId);
  }
}
