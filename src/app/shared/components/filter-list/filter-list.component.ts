import { Component, OnDestroy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Observable, Subject } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { FilterList, FilterListModel } from './shared/filter-list.model';
import { FilterListService } from './shared/filter-list.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-list',
  imports: [SharedModule, MatListModule, MatDividerModule, TranslatePipe],
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnDestroy {
  /** Observable holding the filter list model. */
  filterListModel$: Observable<FilterListModel>;

  /** Subject for managing unsubscriptions. */
  protected sub$ = new Subject<void>();

  /** Initializes the component with filter list data. */
  constructor(private filterListService: FilterListService) {
    this.filterListModel$ = this.filterListService.getItem();
  }

  /** Cleans up subscriptions on component destruction. */
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }

  /** Confirms selection and closes the filter list. */
  onOK(): void {
    this.filterListService.confirm();
  }

  /** Cancels selection and closes the filter list. */
  onCancel(): void {
    this.filterListService.hide();
  }

  /**
   * Toggles selection of a filter item.
   * @param item - The clicked filter list item.
   */
  onClickListOption(item: FilterList): void {
    const model = this.filterListService.getItemValue();
    const newList = model.list.map((listItem) =>
      listItem === item ? { ...listItem, selected: !listItem.selected } : listItem
    );
    this.filterListService.setItem({ ...model, list: newList });
  }

  /** Toggles "select all" and updates the filter state. */
  onSelectAll(): void {
    const currentItem = this.filterListService.getItemValue();
    const updatedItem = { ...currentItem, selectAll: !currentItem.selectAll };
    this.filterListService.setItem(updatedItem);
    this.filterListService.select(updatedItem.selectAll);
  }
}
