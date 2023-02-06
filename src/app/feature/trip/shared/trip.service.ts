import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { toTime } from 'src/app/shared/classes/common.fn';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Trip } from './trip.model';

/**
 * Class representing a service for managing expense for trips.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class TripService extends StoreItems<Trip> {
  /**
   * A property holding http header information.
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Initializes services.
   * @param http Manage http requests.
   * @param errorService Application error service.
   *  @param budgetStateService Manage the state of a budget.
   */
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private budgetStateService: BudgetStateService
  ) {
    super();
  }

  /**
   * Get all trip items from server.
   * @param budgetId The identity number of the selected budget.
   * @returns Observer of an array of `Trip` objects.
   */
  loadTripPage(budgetId: number): Observable<Trip[]> {
    return this.http.get<Trip[]>(`/api/LoadTripPage`, { params: { budgetId } }).pipe(
      tap((items) => {
        this.store.items = items;
        this.updateStore();
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Modify a category item.
   * @param categoryItem The category item to be modified
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `Category` representing the modified category item.
   */
  modifyTrip(tripItem: Trip, action: string): Observable<Trip> {
    return this.http.post<Trip>(`/api/${action}Trip`, { tripItem }, this.httpOptions).pipe(
      tap((item) => {
        switch (action) {
          case Modify.Add:
            this.addItem(item);
            break;
          case Modify.Edit:
            this.editItem(item, 'id');
            break;
          case Modify.Delete:
            this.deleteItem(item, 'id');
            break;
        }
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Validates if a new date is within another trips date range.
   * @param value The new date of a trip item.
   * @param action The action to perform (add, edit or delete).
   * @returns True if the uniqe constraint is violated.
   * @todo Validate if date is crossing other dates.
   */
  betweenDates(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const trips = this.getUnselectedItems(action, 'id');
    return trips.findIndex((x) => this.isBetweenDates(value, x.fromDate, x.toDate)) !== -1;
  }

  /**
   * Validates if a new starting date is greater than an ending date.
   * @param fromDate The starting date of a trip.
   * @param toDate The ending date of a trip.
   * @returns True if the uniqe constraint is violated.
   */
  rangeDateError(fromDate: string, toDate: string): boolean {
    if (!fromDate || !toDate) {
      return false;
    }

    return toTime(fromDate) >= toTime(toDate);
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to check if a date is between two other dates.
   * Convert the date to numerical representation for simplier comparison.
   * @param date The date to verify.
   * @param fromDate The starting date of a trip.
   * @param toDateThe The ending date of a trip.
   * @returns True if date is bweteen fromDate and toDate.
   */
  private isBetweenDates(date: string, fromDate: Date, toDate: Date): boolean {
    return toTime(date) >= toTime(fromDate) && toTime(date) <= toTime(toDate);
  }
}
