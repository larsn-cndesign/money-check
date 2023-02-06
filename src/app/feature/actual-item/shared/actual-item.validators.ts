import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActualItemService } from './actual-item.service';

/**
 * A validator factory function that check if year does not exist in an array of budgets.
 * @param service A service for managing actual expens items.
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const budgetYearNotExistValidator = (service: ActualItemService): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    return service.budgetYearNotExist(control.value) ? { budgetYearNotExist: true } : null;
  };
};
