import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BudgetYearService } from './budget-year.service';

/**
 * A validator factory function that check if year exist in an array of numbers.
 * @description Unique constraint on year.
 * @param service A service for managing budget years.
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const yearExistValidator = (service: BudgetYearService): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return service.yearExist(control.value) ? { duplicate: true } : null;
  };
};
