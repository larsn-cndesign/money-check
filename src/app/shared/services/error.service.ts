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
        return this.translate.instant('error.duplicate', { p1: title });
      }

      if (control.hasError('minlength') && control.errors) {
        return this.translate.instant('error.min_length', {
          p1: title,
          p2: control.errors.minlength.requiredLength,
        });
      }

      if (control.hasError('maxlength') && control.errors) {
        return this.translate.instant('error.max_length', {
          p1: title,
          p2: control.errors.minlength.requiredLength,
        });
      }

      if (control.hasError('email') && control.errors) {
        return this.translate.instant('error.invalid_input', { p1: title });
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
   */
  handleHttpError = (error: HttpErrorResponse): Observable<never> => {
    let content = '';

    if (error.error instanceof ErrorEvent) {
      content = error.error.message;
    } else {
      switch (error.status) {
        case 400:
        case 404:
          content = this.translateError(error.error.LocaleKey, error.error.LocaleParams);
          break;
        case 401:
          content = this.translateError(error.error.LocaleKey, error.error.LocaleParams);
          this.router.navigate(['/login']);
          break;
        case 500:
          content = this.translate.instant('error.server');
          break;
        default:
          content = this.translate.instant('error.unknown');
          break;
      }
    }

    this.messageBoxService.show(new MessageBox('', content, 'error'));
    return throwError(() => error);
  };

  private translateError(localeKey: string, localeParams: string[]): string {
    if (!localeKey || !localeParams) return this.translate.instant('error.unknown');

    // Dynamically create an object for the parameters
    const params = localeParams.reduce((acc, param, index) => {
      acc[`p${index + 1}`] = this.parseMessage(param); // Assign p1, p2, p3, etc.
      return acc;
    }, {} as { [key: string]: string });

    return this.translate.instant(`error.${localeKey}`, params);
  }

  private parseMessage(param: string): string {
    let translation = this.translate.instant(param);

    // If the key doesn't exist, try with the error prefix
    if (translation === param) {
      translation = this.translate.instant(`error.${param}`);

      // Fallback to param
      if (translation === `error.${param}`) return param;
    }

    return translation;
  }
}
