import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  constructor(
    public router: Router,
    private messageBoxService: MessageBoxService,
    private translate: TranslateService
  ) {}

  /**
   * Get error messages for an invalid form control.
   * @param control The form control.
   * @paramThe title of the control (optional).
   * @returns The error message as a string.
   */
  getFormErrorMessage(control: AbstractControl | null, title = ''): string {
    if (control) {
      if (control.hasError('required')) {
        return this.translate.instant('error.required_value');
      }

      if (control.hasError('invalidDate')) {
        return this.translate.instant('error.invalid_date');
      }

      if (control.hasError('isNumber')) {
        return this.translate.instant('error.invalid_number');
      }

      if (control.hasError('unique')) {
        return this.translate.instant('error.duplicate_combination');
      }

      if (control.hasError('betweenDate')) {
        return this.translate.instant('error.date_in_trip');
      }

      if (control.hasError('invalidToDate')) {
        return this.translate.instant('error.invalid_date_order');
      }

      if (control.hasError('duplicate')) {
        return this.translate.instant('error.duplicate', { title: title });
      }

      if (control.hasError('minlength') && control.errors) {
        return this.translate.instant('error.min_length', {
          title: title,
          length: control.errors.minlength.requiredLength,
        });
      }

      if (control.hasError('maxlength') && control.errors) {
        return this.translate.instant('error.max_length', {
          title: title,
          length: control.errors.minlength.requiredLength,
        });
      }

      if (control.hasError('email') && control.errors) {
        return this.translate.instant('error.invalid_input', { title: title });
      }

      if (control.hasError('budgetYearNotExist') && control.errors) {
        return this.translate.instant('error.missing_budget');
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
    let title = this.translate.instant('error.program'); // 'Programfel';

    if (error.error instanceof ErrorEvent) {
      console.error(this.translate.instant('error.occured'), error.error.message);
    } else {
      errorDescription = error.error;

      if (error.status === 400 || error.status === 404) {
        if (error.error?.title && error.error?.description) {
          title = error.error.title;
          errorDescription = error.error.description;
        }
      }

      if (error.status === 401) {
        title = this.translate.instant('error.authorization');
        this.router.navigate(['/login']);
      }

      // console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    this.messageBoxService.show(new MessageBox(title, errorDescription, 'error'));
    return throwError(error);
  };
}
