import { Injectable } from '@angular/core';
import { Currency } from 'src/app/feature/budget-year/shared/budget-year.model';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';

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
    this.addItem(currency);
  }

  /**
   * Method for editing an existing currency in the table.
   * @param currency The currency object to be modified.
   */
  editCurrency(currency: Currency): void {
    this.editItem(currency, 'id');
  }

  /**
   * Method for removing an existing currency in the table.
   * @param currency The currency object to be removed.
   */
  deleteCurrency(currency: Currency): void {
    this.deleteItem(currency, 'id');
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

    const items = this.getItems(action === Modify.Edit);
    return items.findIndex((x) => x.code.toLowerCase() === value.toLowerCase()) !== -1;
  }
}
