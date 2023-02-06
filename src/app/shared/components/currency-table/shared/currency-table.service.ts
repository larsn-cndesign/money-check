import { Injectable } from '@angular/core';
import { Currency } from 'src/app/feature/budget-year/shared/budget-year.model';
import { StoreItems } from 'src/app/shared/classes/store';

/**
 * Class representing a service for a reusable currency table.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class CurrencyTableService extends StoreItems<Currency> {
  constructor() {
    super();
  }

  /**
   * Method for adding a currency to an array of `Currency` objets in a store of.
   * @param currency The currency object to be added.
   */
  addCurrency(currency: Currency): void {
    this.store.items = [...this.store.items, currency];
    this.updateStore();
  }

  /**
   * Method for editing an existing currency in the table.
   * @param currency The currency object to be modified.
   */
  editCurrency(currency: Currency): void {
    this.items.forEach((item) => {
      if (item.id === currency.id) {
        item.currency = currency.currency;
        item.budgetRate = currency.budgetRate;
        item.averageRate = currency.averageRate;
      }
    });

    this.updateStore();
  }

  /**
   * Method for removing an existing currency in the table.
   * @param currency The currency object to be removed.
   */
  deleteCurrency(curr: Currency): void {
    const index = this.items.findIndex((x) => x.id === curr.id);

    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
    this.store.items = [...this.items];
    this.updateStore();
  }

  /**
   * Validates unique constraint on currency.
   * @param value The currency to validate
   * @param action The action to perform (add, edit or delete).
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.currency.toLowerCase() === value.toLowerCase()) !== -1;
  }
}
