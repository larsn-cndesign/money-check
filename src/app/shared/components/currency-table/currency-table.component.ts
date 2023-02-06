import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/feature/budget-year/shared/budget-year.model';

/**
 * Class representing a reusable table for managing currencies.
 */
@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyTableComponent {
  /**
   * An observer of an array of `Currency` objects.
   * @private
   */
  @Input() currencies$!: Observable<Currency[]>;

  /**
   * Setter for the `_deletable` property.
   * @description If the value is true the column used for deleting an item is displayed.
   */

  @Input() set deletable(value: boolean) {
    this._deletable = value;
    if (this._deletable) {
      this.displayedColumns = ['currency', 'budgetRate', 'averageRate', 'delete'];
    } else {
      this.displayedColumns = ['currency', 'budgetRate', 'averageRate'];
    }
  }

  /**
   * An event emitter that emits when a currency is seleced or deleted.
   */
  @Output() changed: EventEmitter<Currency> = new EventEmitter();

  /**
   * A boolean flag to indicate if a currency item can be deleted or not.
   * @default true
   * @private
   */
  private _deletable = true;

  /**
   * A property that holds the columns to be displayed in a table.
   * @public
   */
  displayedColumns: string[] = [];

  /**
   * Method to remove a currency item from the table a currency item.
   * @param e The event of a button element.
   * @param currency The currency to be deleted.
   */
  onDelete(e: Event, currency: Currency): void {
    e.stopPropagation(); // Do not highlight (select) row

    this.changeCurrency(currency, false);
  }

  /**
   * Method to select a currency item in the table.
   * @param currency The selected currency item.
   */
  onSelect(currency: Currency): void {
    this.changeCurrency(currency, true);
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to emit a currency item.
   * @param currency The currency item to emit
   * @param isSelected True if item is selected, false if it is to be deleted.
   */
  changeCurrency(currency: Currency, isSelected: boolean): void {
    currency.selected = isSelected;
    this.changed.emit(currency);
  }
}
