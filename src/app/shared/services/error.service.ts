import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

/**
 * Class representing error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(public router: Router) {}

  /**
   * Get error messages for an invalid form control.
   * @param control The form control.
   * @paramThe title of the control (optional).
   * @returns The error message as a string.
   */
  getFormErrorMessage(control: AbstractControl | null, title = ''): string {
    if (control) {
      if (control.hasError('required')) {
        return 'Du måste ange ett värde';
      }

      if (control.hasError('invalidDate')) {
        return 'Ogiltigt datum';
      }

      if (control.hasError('isNumber')) {
        return 'Ogiltigt nummer';
      }

      if (control.hasError('unique')) {
        return 'Kombinationen finns redan';
      }

      if (control.hasError('betweenDate')) {
        return 'Datumet ingår redan i en resa';
      }

      if (control.hasError('invalidToDate')) {
        return 'Till datum är tidigare än från datum';
      }

      if (control.hasError('duplicate')) {
        return 'Denna ' + title.toLowerCase() + ' finns redan';
      }

      if (control.hasError('minlength') && control.errors) {
        return title + ' måste vara minst ' + control.errors.minlength.requiredLength + ' tecken';
      }

      if (control.hasError('maxlength') && control.errors) {
        return title + ' får högste vara ' + control.errors.maxlength.requiredLength + ' tecken';
      }

      if (control.hasError('email') && control.errors) {
        return title + ' är inte giltigt';
      }

      if (control.hasError('budgetYearNotExist') && control.errors) {
        return 'Budget saknas för detta år';
      }

      return '';
    }

    return '';
  }

  /**
   * Report error to the consol and rethrow it to subscribers so that error can be displayed to the user.
   * @param error The error respoinse from a server http response.
   * @returns An observable of never.
   * @todo Log error.
   * @todo Show error in an user friendly message alert.
   */
  handleHttpError = (error: HttpErrorResponse): Observable<never> => {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    alert(error);
    return throwError(error);
  };
}
