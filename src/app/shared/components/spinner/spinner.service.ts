import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

/**
 * Class representing a spinner service.
 */
@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  /**
   * An observer of a boolean flag if spinner is shown or not.
   * @private
   */
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  /**
   * Getter property for the loading observable.
   * @returns A boolean observable that listen to state changes of the spinner.
   * It loads only if the `lag` property is exceeded before the loading task is completed.
   */
  get loading$(): Observable<boolean> {
    return this._isLoading$.pipe(
      switchMap((loading: boolean) => {
        if (loading) {
          return of(true).pipe(delay(350));
        }

        return of(false);
      })
    );
  }

  /**
   * Creates a spinner service.
   * @description If the HttpRequest is completed before 350ms,  the spinner is never shown.
   */
  constructor() {}

  /**
   * Start the spinner and show it.
   */
  startSpinner(): void {
    this._isLoading$.next(true);
  }

  /**
   * Start the spinner and hide it.
   */
  stopSpinner(): void {
    this._isLoading$.next(false);
  }
}
