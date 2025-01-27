import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { FilterList, FilterListModel } from './shared/filter-list.model';
import { FilterListService } from './shared/filter-list.service';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  imports: [SharedModule, MatListModule, MatDividerModule],
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})
export class FilterListComponent implements OnInit, OnDestroy {
  /**
   * A `FilterListModel` objects representing the model of a filter list.
   * @public
   */
  filterListModel = new FilterListModel();

  /**
   * The subscrition object subscribing to a `FilterList` observable.
   * @private
   */
  private subscription!: Subscription;

  constructor(private filterListService: FilterListService) {}

  /**
   * @description Unsubscribe from the filter list subscription.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @description Subscribes to a `FilterList` object. When notified it shows the filter list.
   */
  ngOnInit(): void {
    this.subscription = this.filterListService.item$.subscribe((filterListModel: FilterListModel) => {
      this.filterListModel = filterListModel;
    });
  }

  /**
   * Close filter list window and emits the filter selection.
   */
  onOK(): void {
    this.filterListService.confirm();
  }

  /**
   * Close filter list window.
   */
  onCancel(): void {
    this.filterListService.hide();
  }

  /**
   * Event listener on list change event.
   * @param item The item that changed.
   */
  onClickListOption(item: FilterList): void {
    item.selected = !item.selected;
  }

  onSelectAll(): void {
    this.filterListModel.selectAll = !this.filterListModel.selectAll;
    this.filterListService.select(this.filterListModel.selectAll);
  }
}
