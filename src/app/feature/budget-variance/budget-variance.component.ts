import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { BudgetVariance, VarianceItem } from './shared/budget-variance.model';
import { BudgetVarianceService } from './shared/budget-variance.service';

/**
 * Class representing budget variance.
 * @todo Add filter on category.
 * @todo Add filter on trip.
 * @todo Add filter on cost per day on a trip.
 */
@Component({
  selector: 'app-budget-variance',
  templateUrl: './budget-variance.component.html',
  styleUrls: ['./budget-variance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetVarianceComponent implements OnInit, OnDestroy {
  /**
   * An observer of a `BudgetVariance` objects.
   * @public
   */
  budgetVariance$: Observable<BudgetVariance>;

  /**
   * An observer of an array of `VarianceItem` objects.
   * @public
   */
  varianceItems$: Observable<VarianceItem[]>;

  /**
   * A Subject that emits values to subscribers.
   * @protected
   */
  protected sub$ = new Subject<void>();

  /**
   * A property that holds the state of the budget.
   * @description Stores budgets and the current selected budget in `localStorage`.
   * @public
   */
  budgetState = new BudgetState();

  /**
   * A boolean flag indicating if data has been loaded from server (@default false).
   * @public
   */
  pageLoaded = false;

  /**
   * A property that holds all columns to be displayed in a table.
   * @public
   */
  displayedColumns: string[] = ['category', 'budget', 'actual', 'variance'];

  /**
   * Creating a budget variance.
   * @param budgetVarianceService A service managing budget variance.
   * @param budgetStateService Manage the state of a budget.
   */
  constructor(private budgetVarianceService: BudgetVarianceService, private budgetStateService: BudgetStateService) {
    this.budgetVariance$ = this.budgetVarianceService.item$;
    this.varianceItems$ = this.budgetVarianceService.items$;
  }

  /**
   * @description Set title of HTML document and get budget variance items from server
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.item$, this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.budgetVarianceService.loadVariancePage(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => {
        this.pageLoaded = true;
      });
  }

  /**
   * @description Unsubscribe from all observables and complete the sub$ subject.
   */
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }

  /**
   * Select a budget varaince item.
   * @param item The selected variance item
   */
  onSelectItem(item: VarianceItem): void {
    this.budgetVarianceService.selectItem(item);
  }

  /**
   * Handles selection change event on the select.
   * @description Filters the budget variance based on a combination of select's.
   * @param e The event object emitted by the select.
   * @param filterType A type representing the select that triggered the change event.
   */
  onChangeFilter(e: MatSelectChange, filterType: string): void {
    this.budgetVarianceService.setFilterItem(e.value, filterType);
    this.getFilteredItems();
  }

  /**
   * Sort table based on selected column. All columns can be sorted.
   * @param sort Holds the name of the column and sorting direction.
   */
  onSortData(sort: Sort): void {
    this.budgetVarianceService.sortData(sort);
  }

  /**
   * Handles double click on an item (budget or actual).
   * @description Navigates to the details of the selected budget or actual item.
   * @param item The selected item.
   * @param type The type of the selected item (budget or actual).
   */
  onDblClickItem(item: VarianceItem, type: string): void {
    this.budgetVarianceService.gotoDetails(item, type);
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method that gets budget variance based on current filter.
   * @param filter Holding current filter settings.
   */
  private getFilteredItems(): void {
    pipeTakeUntil(this.budgetVarianceService.getVarianceItems(), this.sub$).subscribe();
  }
}
