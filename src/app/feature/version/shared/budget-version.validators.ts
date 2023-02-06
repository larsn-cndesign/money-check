import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BudgetVersionService } from './budget-version.service';

/**
 * A validator factory function that check if a version name exist in an array of `BudgetVersion` objects.
 * @param service A service managing budget versions.
 * @param control The name of the control to validate.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const duplicateValidator = (service: BudgetVersionService): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (service.duplicate(control.value)) {
      control.setErrors({ duplicate: true });
      return { duplicate: true };
    }

    return null;
  };
};
