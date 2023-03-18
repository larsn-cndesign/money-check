import { Injectable } from '@angular/core';
import { StoreItem } from 'src/app/shared/classes/store';
import { FilterList, FilterListModel, ListPos } from './filter-list.model';

@Injectable({
  providedIn: 'root',
})
export class FilterListService extends StoreItem<FilterListModel> {
  /**
   * Initializes properties
   */
  constructor() {
    super(new FilterListModel());
  }

  /**
   * If the OK button is clicked the selection is confirmed.
   */
  confirm(): void {
    this.store.item.isOpen = false;
    this.store.item.confirmed = true;

    this.updateStore();
  }

  /**
   * Opens the filter item list window.
   * @param filterList Holds all filter list items
   * @param listPos Holds the position where the filter list window should be opened at.
   */
  show(filterList: FilterList[], listPos: ListPos): void {
    this.store.item.isOpen = true;
    this.store.item.confirmed = false;
    this.store.item.pos = listPos;
    this.store.item.list = filterList;
    this.updateStore();
  }

  /**
   * Hides the filter list.
   */
  hide(): void {
    this.store.item.isOpen = false;
    this.store.item.confirmed = false;
    this.updateStore();
  }

  /**
   * Select or unselect all items in list
   * @param allItems True to select all items in list. False to unselecta all items.
   */
  select(allItems: boolean): void {
    this.store.item.list.forEach((item) => {
      item.selected = allItems;
    });
  }
}
