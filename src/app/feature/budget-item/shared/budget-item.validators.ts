import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BudgetItemService } from './budget-item.service';

/**
 * A validator factory function that compares two strings in an array of `BudgetItem` objects.
 * @description Unique constraint on category and unit name.
 * @param service A service for managing budget items.
 * @param categoryId The name of the category control to validate..
 * @param unitId THe name of the unit control to validate.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const uniqueValidator = (
  service: BudgetItemService,
  categoryId: string,
  unitId: string,
  action: string
): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const category = formGroup.get(categoryId);
    const unit = formGroup.get(unitId);
    const actionControl = formGroup.get(action);

    if (category && unit && actionControl) {
      if (service.unique(+category.value, +unit.value, actionControl.value)) {
        category.setErrors({ unique: true });
        unit.setErrors({ unique: true });
        return { unique: true };
      }
    }

    category?.setErrors(null);
    unit?.setErrors(null);

    return null;
  };
};
