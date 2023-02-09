import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Class representing a custom `ErrorStateMatcher`
 * @implements ErrorStateMatcher
 * @description Return error state immediatlely as sonn as anything is typed inte the input control.
 */
export class ImmediateErrorMatcher implements ErrorStateMatcher {
  /**
   * Method to validate a form control.
   * @param control The FormControl to validate
   * @param _form A `FormGroupDirective` (not used)
   * @returns True if the form control is invalid.
   */
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

/**
 * Class representing a custom `ErrorStateMatcher`
 * @implements ErrorStateMatcher
 * @description Return error state immediatlely, even if control has not been tuched.
 */
export class ImmediateUntouchedErrorMatcher implements ErrorStateMatcher {
  /**
   * Method to validate a form control.
   * @param control The FormControl to validate
   * @param _form A `FormGroupDirective` (not used)
   * @returns True if the form control is invalid.
   */
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid);
  }
}
