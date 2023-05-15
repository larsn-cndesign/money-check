import { BehaviorSubject, Observable } from 'rxjs';
import { Modify } from '../enums/enums';
import { Selectable } from '../interfaces/selectable';

/**
 * StoreItem is a generic class that can be used with any type.
 * @description Represent a store that is used by a service to keep the current state
 * of an object and an array of objects.
 * @template T Any type of object.
 * @template U Any type of array that includes a `selected` property (optional).
 *
 * @usageNote
 *
 *  ### Service extends a `StoreItem`
 *
 * Example of a service extending a `StoreItem` object an initialize in the constructor.
 *
 * ```typescript
 * @Injectable({
 *   providedIn: 'root',
 * })
 * export class UserService extends StoreItem<AppUser> {
 *   constructor() {
 *     super(new AppUser());
 *   }
 * }
 * ```
 */
export class StoreItem<T, U extends Selectable = any> {
  /**
   * A BehaviorSubject that emits the current value of T to its subscribers.
   * @private
   */
  private _item$: BehaviorSubject<T>;

  /**
   * A BehaviorSubject that emits the current value of U[] to its subscribers.
   * @private
   */
  private _items$: BehaviorSubject<U[]>;

  /**
   * A property that holds the current value of T and U[].
   * @protected
   */
  protected store: { item: T; items: U[] };

  /**
   * Get an observable of the T type.
   * @returns An observable of T.
   */
  get item$(): Observable<T> {
    return this._item$.asObservable();
  }

  /**
   * Get an observable of the U[] type.
   * @returns An observable of U[].
   */
  get items$(): Observable<U[]> {
    return this._items$.asObservable();
  }

  /**
   * Get the item object from store.
   * @returns An object of type T.
   */
  get item(): T {
    return this.store.item;
  }

  /**
   * Set the item object in store and emit the new value to any subscribers.
   * @param value The value to set the item object to.
   */
  set item(value: T) {
    this.store.item = value;
    this.updateStore();
  }

  /**
   * Get the items array object from store.
   * @returns An object of type U[].
   */
  get items(): U[] {
    return this.store.items;
  }

  /**
   * Create a new store.
   * @param instance The item to store in T.
   * @param listItems Items to store in U[] (optional). When omitted it is set to an emty array.
   */
  constructor(instance: T, listItems?: U[]) {
    this._item$ = new BehaviorSubject<T>(instance);
    this._items$ = new BehaviorSubject<U[]>([]);
    this.store = { item: instance, items: listItems ? listItems : [] };
  }

  /**
   * Unselect all items in the array of U.
   * @param updateStore True to emit the change to subscribers.
   */
  clearSelection(updateStore = true): void {
    this.store.items.forEach((item) => (item.selected = false));

    if (updateStore) {
      this.updateStore();
    }
  }

  /**
   * Select an item in the array of U. Emit changes to subscribers.
   * @param item The item to be selected.
   */
  selectItem(item: U): void {
    this.clearSelection(false);
    item.selected = true;
    this.updateStore();
  }

  /**
   * Get all unselected items in the array of U if editing an item. Othervise get all items.
   * @param action Holds the action to perform (add or edit).
   * @param id The name of the identity property of the item.
   * @returns An array of type U[].
   */
  getUnselectedItems(action: string, id: keyof U): U[] {
    let array = [...this.store.items] as U[];

    if (action === Modify.Edit) {
      const item = array.find((x) => x.selected);
      if (item) {
        array = array.filter((x) => x[id] !== item[id]);
      }
    }
    return array;
  }

  /**
   * Add an item to the array of U. Emit changes to subscribers.
   * @param item The item to add.
   */
  addItem(item: U): void {
    this.store.items = [item, ...this.store.items];
    this.updateStoreItems(false);
  }

  /**
   * Edit an existing item in the array of U. Emit changes to subscribers.
   * @param item The item to change.
   * @param id The name of the identity property of the item.
   */
  editItem(item: U, id: keyof U): void {
    const index = this.store.items.findIndex((x) => x[id] === item[id]);
    if (index !== -1) {
      this.store.items[index] = item;
      this.updateStoreItems();
    }
  }

  /**
   * Remove item from the array of U.
   * @param item The item to remove.
   * @param id The name of the identity property of the item.
   */
  deleteItem(item: U, id: keyof U): void {
    const index = this.store.items.findIndex((x) => x[id] === item[id]);
    if (index !== -1) {
      this.store.items.splice(index, 1);
    }

    this.updateStoreItems();
  }

  /**
   * Emit current value of type T to subscribers.
   */
  updateStore(): void {
    this._item$.next(Object.assign({}, this.store).item);
  }

  /**
   * Emit current value of an array of type U to subscribers.
   * @param runChangeDetection True to force change detection so that the latest value is emitted to subscribers (@default true).
   */
  updateStoreItems(runChangeDetection = true): void {
    if (runChangeDetection) {
      this.store.items = [...this.store.items];
    }
    this._items$.next(Object.assign({}, this.store).items);
  }
}

/**
 * StoreItems is a generic class that can be used with any type.
 * @description Represent a store that is used by a service to keep the current state
 * of an array of objects.
 * @template T Any type of array that includes a `selected` property.
 *
 * @usageNote
 *
 *  ### Service that extends a `StoreItems`
 *
 * Example of a service extending a `StoreItems` object an initialize in the constructor.
 *
 * ```typescript
 * @Injectable({
 *   providedIn: 'root',
 * })
 * export class CategoryService extends StoreItems<Category> {
 *   constructor() {
 *     super();
 *   }
 * }
 * ```
 */
export class StoreItems<T extends Selectable> {
  /**
   * A BehaviorSubject that emits the current value of T[] to its subscribers.
   * @private
   */
  private _items$ = new BehaviorSubject<T[]>([]);

  /**
   * A property that holds the current value of T[].
   * @protected
   */
  protected store: { items: T[] };

  /**
   * Get an observable of the T[] type.
   * @returns An observable of T[].
   */
  get items$(): Observable<T[]> {
    return this._items$.asObservable();
  }

  /**
   * Get items object from store.
   * @returns An object of type T[].
   */
  get items(): T[] {
    return this.store.items;
  }

  /**
   * Set the items object in store and emit the new value to any subscribers.
   * @param value The value to set the items object to.
   */
  set items(value: T[]) {
    this.store.items = value;
    this.updateStore();
  }

  /**
   * Create a new store.
   */
  constructor() {
    this.store = { items: [] };
  }

  /**
   * Unselect all items in the array of T.
   * @param updateStore True to emit the change to subscribers.
   */
  clearSelection(updateStore = true): void {
    this.store.items.forEach((item) => (item.selected = false));

    if (updateStore) {
      this.updateStore();
    }
  }

  /**
   * Select an item in the array of T. Emit changes to subscribers.
   * @param item The item to be selected.
   */
  selectItem(item: T): void {
    this.clearSelection(false);
    item.selected = true;
    this.updateStore();
  }

  /**
   * Get all unselected items in the array of T if editing an item. Othervise get all items.
   * @param action Holds the action to perform (add or edit).
   * @param id The name of the identity property of the item.
   * @returns An array of type T[].
   */
  getUnselectedItems(action: string, id: keyof T): T[] {
    let array = [...this.items] as T[];

    if (action === Modify.Edit) {
      const item = array.find((x) => x.selected);
      if (item) {
        array = array.filter((x) => x[id] !== item[id]);
      }
    }
    return array;
  }

  /**
   * Add an item to the array of T. Emit changes to subscribers.
   * @param item The item to add.
   */
  addItem(item: T): void {
    this.store.items = [...this.store.items, item];
    this.updateStore();
  }

  /**
   * Edit an existing item in the array of T. Emit changes to subscribers.
   * @param item The item to change.
   * @param id The name of the identity property of the item.
   */
  editItem(item: T, id: keyof T): void {
    const index = this.store.items.findIndex((x) => x[id] === item[id]);
    if (index !== -1) {
      this.store.items[index] = item;
      this.updateStore();
    }
  }

  /**
   * Remove item from the array of T.
   * @param item The item to remove.
   * @param id The name of the identity property of the item.
   */
  deleteItem(item: T, id: keyof T): void {
    const index = this.store.items.findIndex((x) => x[id] === item[id]);
    if (index !== -1) {
      this.store.items.splice(index, 1);
    }

    this.updateStore();
  }

  /**
   * Emit current value of an array of type T to subscribers.
   * @param runChangeDetection True to force change detection so that the latest value is emitted to subscribers.
   */
  updateStore(runChangeDetection = true): void {
    if (runChangeDetection) {
      this.store.items = [...this.store.items];
    }
    this._items$.next(Object.assign({}, this.store).items);
  }
}
