import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { Unit } from './unit.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Class representing a service for managing units.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class UnitService extends StoreItems<Unit> {
  /**
   * Initializes services.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private httpService: HttpService, private translate: TranslateService) {
    super();
  }

  /**
   * Get all unit items from server.
   * @param budgetId The identity number of the selected budget.
   * @returns Observer of an array of `Unit` objects.
   */
  getUnits(budgetId: number): Observable<Unit[]> {
    return this.httpService.getItemsById<Unit>(budgetId, 'unit').pipe(
      tap((items) => {
        this.items = items;
      })
    );
  }

  /**
   * Modify a unit item.
   * @param budget The unit item to be modified.
   * @param action The action to perform (add, edit, delete).
   * @returns An observable of a `Unit` representing the modified unit item.
   */
  modifyUnit(unit: Unit, action: string): Observable<Unit> {
    switch (action) {
      case Modify.Add:
        return this.httpService.postItem<Unit>(unit, 'unit').pipe(tap((item) => this.addItem(item)));
      case Modify.Edit:
        return this.httpService.putItem<Unit>(unit, 'unit').pipe(tap((item) => this.editItem(item, 'id')));
      case Modify.Delete:
        return this.httpService.deleteItem<Unit>(unit, 'unit').pipe(tap((item) => this.deleteItem(item, 'id')));
    }

    throw new HttpErrorResponse({ error: `${action}: ${this.translate.instant('error.unknown_event')}` });
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

    const items = this.getItems(action === Modify.Edit);
    return items.findIndex((x) => x.unitName.toLowerCase() === value.toLowerCase()) !== -1;
  }
}
