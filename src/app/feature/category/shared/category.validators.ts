import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CategoryService } from './category.service';

/**
 * A validator factory function that check if a category name exist in an array of `Category` objects.
 * @param service A service managing categories.
 * @param control The name of the control to validate.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const duplicateValidator = (service: CategoryService, control: string, action: string): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const categoryControl = formGroup.get(control);
    const actionControl = formGroup.get(action);

    if (categoryControl && actionControl) {
      if (service.duplicate(categoryControl.value, actionControl.value)) {
        categoryControl.setErrors({ duplicate: true });
        return { duplicate: true };
      }
    }

    return null;
  };
};
