export class FilterListModel {
  isOpen = false;
  confirmed = false;
  list: FilterList[] = [];
  pos: ListPos = { x: 0, y: 0 };
  selectAll = true;
}

export interface FilterList {
  id?: number;
  name: string;
  selected: boolean;
}

export interface ListPos {
  x: number;
  y: number;
}
