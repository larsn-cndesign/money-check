import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UnitService } from './unit.service';

/**
 * A validator factory function that check if a unit name exist in an array of `Unit` objects.
 * @param service A service managing categories.
 * @param control The name of the control to validate.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const duplicateValidator = (service: UnitService, control: string, action: string): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const unitItem = formGroup.get(control);
    const actionControl = formGroup.get(action);

    if (unitItem && actionControl) {
      if (service.duplicate(unitItem.value, actionControl.value)) {
        unitItem.setErrors({ duplicate: true });
        return { duplicate: true };
      }
    }

    return null;
  };
};
