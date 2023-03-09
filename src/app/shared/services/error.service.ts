import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { MessageBox } from '../components/message-box/shared/message-box.model';
import { MessageBoxService } from '../components/message-box/shared/message-box.service';

/**
 * Class representing error handling.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  /**
   * Initializes services.
   * @param router Navigation service.
   * @param messageBoxService Manage messages to show to the user.
   */
  constructor(public router: Router, private messageBoxService: MessageBoxService) {}

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
   */
  handleHttpError = (error: HttpErrorResponse): Observable<never> => {
    let errorDescription = '';
    let title = 'Programfel';

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      errorDescription = error.error;

      if (error.status === 400 || error.status === 404) {
        if (error.error?.title && error.error?.description) {
          title = error.error.title;
          errorDescription = error.error.description;
        }
      }

      if (error.status === 401) {
        title = 'Behörighet saknas';
        this.router.navigate(['/login']);
      }

      // console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    console.log(error);
    this.messageBoxService.show(new MessageBox(title, errorDescription, 'error'));
    return throwError(error);
  };
}
