import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Subject, switchMap, tap } from 'rxjs';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { MONTHS } from 'src/app/shared/classes/constants';
import { ListPos } from 'src/app/shared/components/filter-list/shared/filter-list.model';
import { FilterListService } from 'src/app/shared/components/filter-list/shared/filter-list.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetVariance, VarianceItem } from './shared/budget-variance.model';
import { BudgetVarianceService } from './shared/budget-variance.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

/**
 * Class representing budget variance.
 * @todo Add filter on trip.
 * @todo Add filter on cost per day on a trip.
 */
@Component({
  selector: 'app-budget-variance',
  imports: [SharedModule, MatTableModule, MatSelectModule, MatCheckboxModule, MatSortModule, TranslatePipe],
  templateUrl: './budget-variance.component.html',
  styleUrls: ['./budget-variance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetVarianceComponent implements OnInit, OnDestroy {
  /**
   * Signal representing the current state of `BudgetVariance`.
   * @public
   */
  budgetVariance: Signal<BudgetVariance>;

  /**
   * Signal representing the current state of `VarianceItem` objects.
   * @public
   */
  varianceItems: Signal<VarianceItem[]>;

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
   * A boolean subject flag indicating if data has been loaded from server.
   * @public
   * @default false
   */
  pageLoaded = signal(false);

  /**
   * A property that holds all columns to be displayed in a table.
   * @public
   */
  displayedColumns: string[] = ['category', 'budget', 'actual', 'variance'];

  /**
   * A property that holds all months to be displayed in the table.
   * @public
   */
  months = MONTHS;

  /**
   * Timeout reference to distinguish between single and double clicks.
   */
  private clickTimeout: any;

  /**
   * Delay (in ms) before executing a single click to check for double-click.
   */
  private delayClick = 250;

  /**
   * Flag to prevent single-click execution if a double-click occurs.
   */
  private preventClick = false;

  /**
   * Creating a budget variance.
   * @param budgetVarianceService A service managing budget variance.
   * @param budgetStateService Manage the state of a budget.
   * @param filterListService Service to manage filtering of categories.
   * @param translate - The translation service used to manage language settings.
   */
  constructor(
    private budgetVarianceService: BudgetVarianceService,
    private budgetStateService: BudgetStateService,
    private filterListService: FilterListService,
    private translate: TranslateService
  ) {
    this.budgetVariance = this.budgetVarianceService.getItem();
    this.varianceItems = this.budgetVarianceService.getItems();
  }

  /**
   * @description Set title of HTML document and get budget variance items from server
   */
  ngOnInit(): void {
    this.months.map((month, index) => {
      pipeTakeUntil(this.translate.get(`months.month_${index}`), this.sub$).subscribe((value: string) => {
        month.name = value;
      });
    });

    pipeTakeUntil(this.budgetStateService.getItem(), this.sub$)
      .pipe(
        tap((budgetState) => (this.budgetState = budgetState)),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.budgetVarianceService.loadVariancePage(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => this.pageLoaded.set(true));

    pipeTakeUntil(this.filterListService.getItem(), this.sub$).subscribe((item) => {
      if (item && item.confirmed) {
        const currentItem = this.budgetVarianceService.getItemValue();
        const updatedItem = { ...currentItem, filter: { ...currentItem.filter, list: item.list } };
        this.budgetVarianceService.setItem(updatedItem);
        this.getFilteredItems();
      }
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
    this.clickTimeout = setTimeout(() => {
      if (!this.preventClick) {
        this.budgetVarianceService.selectItem(item);
      }
      this.preventClick = false;
    }, this.delayClick);
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
   * Handles selection change event on the checkbox.
   * @description Filters the budget variance based on a combination of select's and checkbox.
   * @param e The event object emitted by the checkbox.
   * @param filterType A type representing the select that triggered the change event.
   */
  onChangeTravelDay(e: MatCheckboxChange, filterType: string): void {
    this.budgetVarianceService.setFilterItem(e.checked, filterType);
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
    clearTimeout(this.clickTimeout);
    this.preventClick = true;

    this.budgetVarianceService.gotoDetails(item, type);
  }

  /**
   * Opens the filter list item window.
   * @param e The event object emitted by the mat-icon.
   */
  OnOpenFilterList(e: MouseEvent): void {
    e.stopPropagation();

    const listPos: ListPos = { x: e.clientX, y: e.clientY };
    const filterList = this.budgetVarianceService.getFilterList();

    this.filterListService.show(filterList, listPos);
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
