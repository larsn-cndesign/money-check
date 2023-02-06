import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Unit } from './unit.model';

/**
 * Class representing a service for managing units.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class UnitService extends StoreItems<Unit> {
  /**
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Initializes services.
   * @param http Manage http requests.
   * @param errorService Application error service.
   * @param budgetStateService Manage the state of a budget.
   */
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private budgetStateService: BudgetStateService
  ) {
    super();
  }

  /**
   * Get all unit items from server.
   * @param budgetId The identity number of the selected budget.
   * @returns Observer of an array of `Unit` objects.
   */
  loadUnitPage(budgetId: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(`/api/LoadUnitPage`, { params: { budgetId } }).pipe(
      tap((items) => {
        this.store.items = items;
        this.updateStore();
      }),
      catchError(this.errorService.handleHttpError)
    );
  }

  /**
   * Modify a unit item.
   * @param unitItem The unit item to be modified
   * @param action The action to perform (add, edit or delete).
   * @returns An observable of a `Unit` representing the modified Unit item.
   */
  modifyUnit(unitItem: Unit, action: string): Observable<Unit> {
    return this.http.post<Unit>(`/api/${action}Unit`, { unitItem }, this.httpOptions).pipe(
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
   * Validates unique constraint on unit name.
   * @param value The new name of a unit item
   * @param action The action to perform (add, edit or delete).
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.unitName.toLowerCase() === value.toLowerCase()) !== -1;
  }
}
