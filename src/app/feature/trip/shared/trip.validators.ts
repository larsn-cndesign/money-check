import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TripService } from './trip.service';

/**
 * A validator factory function that check if a date is within another trips date range.
 * @param tripService A service for managing trips.
 * @param action The name of the action control holding the current action (add or edit).
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const betweenDateValidator = (tripService: TripService, action = ''): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const actionControl = control.parent?.get(action);

    return tripService.betweenDates(control.value, actionControl?.value) ? { betweenDate: true } : null;
  };
};

/**
 * A validator factory function that check if a starting date is greater than an ending date.
 * @param tripService A service for managing trips.
 * @param fromDate The starting date of a trip.
 * @param toDate The ending date of a trip.
 * @returns An object containing the validation error key-value pair, or null if the validation passes.
 */
export const rangeDateValidator = (tripService: TripService, fromDate: string, toDate: string): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const from = formGroup.get(fromDate);
    const to = formGroup.get(toDate);

    if (tripService.rangeDateError(from?.value, to?.value)) {
      to?.setErrors({ invalidToDate: true });
      return { invalidToDate: true };
    }

    return null;
  };
};
