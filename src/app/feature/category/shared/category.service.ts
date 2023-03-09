import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { Category } from './category.model';

/**
 * Class representing a service for managing expense categories.
 * @extends StoreItems
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends StoreItems<Category> {
  /**
   * Initializes services.
   * @param httpService Helper service for managing CRUD operations.
   */
  constructor(private httpService: HttpService) {
    super();
  }

  /**
   * Get all category items from server.
   * @param budgetId The identity number of the selected budget.
   * @returns Observer of an array of `Category` objects.
   */
  getCategories(budgetId: number): Observable<Category[]> {
    return this.httpService.getItemsById<Category>(budgetId, 'category').pipe(
      tap((items) => {
        this.store.items = items;
        this.updateStore();
      })
    );
  }

  /**
   * Modify a category item.
   * @param budget The category item to be modified.
   * @param action The action to perform (add, edit, delete).
   * @returns An observable of a `Category` representing the modified category item.
   */
  modifyCategory(category: Category, action: string): Observable<Category> {
    switch (action) {
      case Modify.Add:
        return this.httpService.postItem<Category>(category, 'category').pipe(tap((item) => this.addItem(item)));
      case Modify.Edit:
        return this.httpService.putItem<Category>(category, 'category').pipe(tap((item) => this.editItem(item, 'id')));
      case Modify.Delete:
        return this.httpService
          .deleteItem<Category>(category, 'category')
          .pipe(tap((item) => this.deleteItem(item, 'id')));
    }

    throw new HttpErrorResponse({ error: `${action}: okänd händelse` });
  }

  /**
   * Validates unique constraint on category name.
   * @param value The new name of a category item
   * @param action The action to perform (add or edit).
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.categoryName.toLowerCase() === value.toLowerCase()) !== -1;
  }
}
