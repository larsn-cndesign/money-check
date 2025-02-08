import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { BudgetState } from '../classes/budget-state.model';
import { ImmediateErrorMatcher } from '../models/immediate-error-state';
import { ErrorService } from './error.service';

/**
 * A utility class representing common form functionalities.
 */
@Injectable({
  providedIn: 'root',
})
export class CommonFormService implements OnDestroy {
  /**
   * Injects the error service
   */
  private errorService = inject(ErrorService);

  /**
   * A Subject that emits values to subscribers.
   * @protected
   */
  protected sub$ = new Subject<void>();

  /**
   * A property to hold a custom error state matcher.
   * @public
   */
  matcher = new ImmediateErrorMatcher();

  /**
   * A property that holds the state of the budget.
   * @description Stores budgets and the current selected budget in `localStorage`.
   * @public
   */
  budgetState = new BudgetState();

  /**
   * A boolean subject flag indicating if data has been loaded from server.
   * @public
   * @default false
   */
  pageLoaded = signal<boolean>(false);

  /**
   * Get error messages for an invalid form control.
   * @param control The form control.
   * @param {string} [title] The title of the control (optional).
   * @returns The error message as a string.
   */
  getErrorMessage(control: AbstractControl | null, title?: string): string {
    return this.errorService.getFormErrorMessage(control, title);
  }

  /**
   * @description Unsubscribe from all observables and complete the sub$ subject.
   */
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
