import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { BudgetState } from '../classes/budget-state.model';
import { ConfirmDialogService } from '../components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from '../components/message-box/shared/message-box.service';
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
  pageLoaded$ = new BehaviorSubject<boolean>(false);

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
   * Initializes services, observables and sets the document title.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {}

  /**
   * @description Unsubscribe from all observables and complete the sub$ subject.
   */
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
