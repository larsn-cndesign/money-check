import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, signal, Signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { Currency } from 'src/app/feature/budget-year/shared/budget-year.model';
import { toNumber } from '../../classes/common.fn';
import { Modify } from '../../enums/enums';
import { ImmediateErrorMatcher } from '../../models/immediate-error-state';
import { ErrorService } from '../../services/error.service';
import { isNumberValidator } from '../../validators/common.validators';
import { CurrencyTableComponent } from '../currency-table/currency-table.component';
import { CurrencyTableService } from '../currency-table/shared/currency-table.service';
import { duplicateValidator } from '../currency-table/shared/currency-table.validators';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Class representing a custom form control for managing currencies.
 * Its compatible with reactive forms, as well as with all built-in and custom form validators.
 * @description Delegate as much as possible. Get all information needed from the form object.
 * @implements OnDestroy, ControlValueAccessor, Validator.
 *
 * @usageNote
 *
 *  ### Example usage of the custom form control
 *
 * ```typescript
 * <app-currency-form
 *    [currencies$]="currencies$"
 *    [deletable]="false"
 *    formControlName="currencyForm"
 *   ></app-currency-form>
 * ```
 */
@Component({
  selector: 'app-currency-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    CurrencyTableComponent,
    TranslatePipe,
  ],
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CurrencyFormComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CurrencyFormComponent,
    },
  ],
})
export class CurrencyFormComponent implements OnDestroy, ControlValueAccessor, Validator {
  /**
   * An observer of an array of `Currency` objects.
   * @public
   */
  @Input() currencies: Signal<Currency[]> = signal([]);

  /**
   * A boolean flag indicating if a currency can be deleted from a table.
   * @public
   */
  @Input() deletable = true;

  /**
   * The form group that holds the form controls.
   * @public
   */
  form: FormGroup;

  /**
   * An array of `Subscription` objects.
   * @private
   */
  private onChangeSubs: Subscription[] = [];

  /**
   * A property to hold a custom error state matcher.
   * @public
   */
  matcher = new ImmediateErrorMatcher();

  /**
   * Unique identity number for a budget item.
   * @public
   */
  onTouched = () => {};

  /**
   * Getter property for the code form control
   * @returns The code form control
   */
  get code(): AbstractControl | null {
    return this.form.get('code');
  }

  /**
   * Getter property for the budgetRate form control
   * @returns The budgetRate form control
   */
  get budgetRate(): AbstractControl | null {
    return this.form.get('budgetRate');
  }

  /**
   * Getter property for the averageRate form control
   * @returns The averageRate form control
   */
  get averageRate(): AbstractControl | null {
    return this.form.get('averageRate');
  }

  /**
   * Get error messages for an invalid form control
   * @param control The form control
   * @param {string} [title] The title of the control (optional)
   * @returns The error message as a string
   */
  getErrorMessage(control: AbstractControl | null, title?: string): string {
    return this.errorService.getFormErrorMessage(control, title);
  }

  /**
   * Initializes services and form controls.
   * @param currencyTableService Service for managing a currency table.
   * @param errorService Application error service.
   */
  constructor(private currencyTableService: CurrencyTableService, private errorService: ErrorService) {
    this.form = new FormGroup(
      {
        action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
        id: new FormControl(-1, { nonNullable: true }),
        code: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
        budgetRate: new FormControl('', isNumberValidator()),
        averageRate: new FormControl('', isNumberValidator()),
      },
      { validators: [duplicateValidator(this.currencyTableService, 'code', 'action')] }
    );
  }

  /**
   * @description Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  /**
   * Method for modifying currency items in a `StoreItems` object with help of a `CurrencyTableService`.
   * @param e A button click event.
   */
  onSaveCurrency(e: Event): void {
    e.preventDefault();

    const items = this.currencyTableService.items()?.[0];

    const val = this.form.value;
    const currency = {
      id: val.id,
      code: val.code,
      versionId: items ? items.versionId : -1,
      budgetRate: toNumber(val.budgetRate),
      averageRate: toNumber(val.averageRate),
      selected: false,
    } as Currency;

    if (val.action === Modify.Add) {
      this.currencyTableService.addCurrency(currency);
    } else {
      this.currencyTableService.editCurrency(currency);
    }

    this.currencyTableService.clearSelection();
    this.resetForm();
  }

  /**
   * Listener for the changed event emitted by the CurrencyTableComponent.
   * Event is emitted when a currency is seleced or deleted.
   * @param item The currency to be modified.
   */
  onChangeCurrency(item: Currency): void {
    if (item.selected) {
      this.selectCurrency(item);
    } else {
      this.deleteCurrency(item);
    }
  }

  // Required by the ControlValueAccessor
  registerOnChange(onChange: any): void {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }

  // Required by the ControlValueAccessor but not used
  setDisabledState(): void {}

  /**
   * Required by the ControlValueAccessor. Stores the provided function as an internal method.
   */
  registerOnTouched(onTouched: () => {}): void {
    this.onTouched = onTouched;
  }

  /**
   * Required by the ControlValueAccessor. Writes a value to the native DOM element.
   */
  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  /**
   * Required by the ControlValueAccessor. Check if the embedded form controls have
   * any errors and pass them to the ValidationErrors object.
   */
  validate(): any {
    if (this.form.valid) {
      return null;
    }

    let errors: any = {};

    errors = this.addControlErrors(errors, 'code');
    errors = this.addControlErrors(errors, 'budgetRate');
    errors = this.addControlErrors(errors, 'averageRate');

    return errors;
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to add control errors to the ValidationErrors object.
   * @private
   * @param allErrors An object containing the validation error key-value pair.
   * @param controlName The name of the control.
   * @returns An object containing the validation error key-value pair.
   */
  private addControlErrors(allErrors: any, controlName: string): any {
    const errors = { ...allErrors };

    const controlErrors = this.form.controls[controlName].errors;
    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }

  /**
   * Helper method for selecting a currency in `StoreItems` object and display values in form controls.
   * @param item The selected currency object.
   */
  private selectCurrency(item: Currency): void {
    this.currencyTableService.getItem(item);
    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      code: item.code,
      budgetRate: item.budgetRate.toString().replace('.', ','),
      averageRate: item.averageRate.toString().replace('.', ','),
    });
  }

  /**
   * Helper method for deleting a currency from `StoreItems` object.
   * @param item
   */
  private deleteCurrency(item: Currency): void {
    this.currencyTableService.deleteCurrency(item);
  }

  /**
   * Helper method for resetting form.
   */
  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({ action: Modify.Add });
  }
}
