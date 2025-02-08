import { Injectable } from '@angular/core';
import { StoreItemAsync } from 'src/app/shared/classes/store';
import { FilterList, FilterListModel, ListPos } from './filter-list.model';

@Injectable({
  providedIn: 'root',
})
export class FilterListService extends StoreItemAsync<FilterListModel> {
  constructor() {
    super(new FilterListModel());
  }

  /**
   * If the OK button is clicked the selection is confirmed.
   */
  confirm(): void {
    const currentItem = this.getItemValue();
    const updatedItem = { ...currentItem, isOpen: false, confirmed: true };
    this.setItem(updatedItem);
  }

  /**
   * Opens the filter item list window.
   * @param filterList Holds all filter list items
   * @param listPos Holds the position where the filter list window should be opened at.
   */
  show(filterList: FilterList[], listPos: ListPos): void {
    const currentItem = this.getItemValue();
    const updatedItem = { ...currentItem, isOpen: true, confirmed: false, pos: listPos, list: filterList };
    this.setItem(updatedItem);
  }

  /**
   * Hides the filter list.
   */
  hide(): void {
    const currentItem = this.getItemValue();
    const updatedItem = { ...currentItem, isOpen: false, confirmed: false };
    this.setItem(updatedItem);
  }

  /**
   * Select or unselect all items in list
   * @param allItems True to select all items in list. False to unselect all items.
   */
  select(allItems: boolean): void {
    const currentItem = this.getItemValue();

    currentItem.list.forEach((item) => {
      item.selected = allItems;
    });
    const updatedItem = { ...currentItem };
    this.setItem(updatedItem);
  }
}
