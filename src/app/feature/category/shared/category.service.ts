import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { StoreItems } from 'src/app/shared/classes/store';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { ErrorService } from 'src/app/shared/services/error.service';
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
   * Get all category items from server.
   * @param budgetId The identity number of the selected budget.
   * @returns Observer of an array of `Category` objects.
   */
  loadCategoryPage(budgetId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`/api/LoadCategoryPage`, { params: { budgetId } }).pipe(
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
  modifyCategory(categoryItem: Category, action: string): Observable<Category> {
    return this.http.post<Category>(`/api/${action}Category`, { categoryItem }, this.httpOptions).pipe(
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
   * Validates unique constraint on category name.
   * @param value The new name of a category item
   * @param action The action to perform (add, edit or delete).
   * @returns True if the uniqe constraint is violated.
   */
  duplicate(value: string, action: string): boolean {
    if (!value || !action) {
      return false;
    }

    const items = this.getUnselectedItems(action, 'id');
    return items.findIndex((x) => x.categoryName.toLowerCase() === value.toLowerCase()) !== -1;
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------
}
