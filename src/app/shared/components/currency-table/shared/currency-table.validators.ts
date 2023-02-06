import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CurrencyTableService } from './currency-table.service';

/**
 * A validator factory function that check if a currency exist in an array of `Currency` objects.
 * @param service A service managing currencies.
 * @param control The name of the control to validate.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const duplicateValidator = (service: CurrencyTableService, control: string, action: string): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const currencyItem = formGroup.get(control);
    const actionControl = formGroup.get(action);

    if (currencyItem && actionControl) {
      if (service.duplicate(currencyItem.value, actionControl.value)) {
        currencyItem.setErrors({ duplicate: true });
        return { duplicate: true };
      }
    }

    return null;
  };
};
