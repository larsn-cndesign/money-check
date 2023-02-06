import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNumber } from '../classes/common.fn';

/**
 * A validator factory function that check if an input is in a valid number format.
 * @param control The name of the control to validate.
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const isNumberValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return !control.value || !isNumber(control.value) ? { isNumber: true } : null;
  };
};
