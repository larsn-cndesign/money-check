import { BehaviorSubject, Observable } from 'rxjs';
import { Modify } from '../enums/enums';
import { Selectable } from '../interfaces/selectable';
import { Signal, signal, WritableSignal } from '@angular/core';

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
   * Public read-only signal holding a single store item of type T.
   */
  private item: WritableSignal<Readonly<T>>;

  /**
   * A Signal that holds an array of items of type U.
   */
  private items = signal<U[]>([]);

  constructor(defaultItem: T) {
    this.item = signal<T>(defaultItem);
  }

  /**
   * Retrieves the current store item as a read-only object.
   *
   * @returns A read-only copy of the current item of type T.
   */
  getItemValue(): Readonly<T> {
    return this.item();
  }

  /**
   * Provides access to the writable signal for the store item.
   * This allows subscribing to changes or integrating with reactive APIs.
   *
   * @returns The writable signal containing a read-only item of type T.
   */
  getItem(): WritableSignal<Readonly<T>> {
    return this.item;
  }

  /**
   * Updates the store with a new item.
   * This method ensures immutability by replacing the store item with a new object.
   * @param item The new item of type T to be stored.
   */
  setItem(item: T): void {
    this.item.set(item);
  }

  // ----------- Array of U Items -----------

  /**
   * Retrieves an array of unselected items, optionally filtering out selected ones.
   * @param skipSelected True to exclude selected items.
   */
  getItemValues(skipSelected = false): U[] {
    return skipSelected ? this.items().filter((x) => !x.selected) : this.items();
  }

  /**
   * Retrieves the writable signal holding an array of store items.
   * Use this method for subscribing to changes or performing reactive operations.
   *
   * @returns The writable signal containing an array of U items.
   */
  getItems(): WritableSignal<U[]> {
    return this.items;
  }

  /**
   * Replaces the current array of store items with a new array.
   * @param items An array of type U that will replace the current store items.
   */
  setItems(items: U[]) {
    this.items.set([...items]);
  }

  /**
   * Selects an item and deselects all others.
   * @param item The item to be selected.
   */
  selectItem(item: U): void {
    this.items.update((items) => items.map((i) => ({ ...i, selected: i === item })));
  }

  /**
   * Unselects all items in the array.
   */
  clearSelection(): void {
    this.items.update((items) => items.map((item) => ({ ...item, selected: false })));
  }

  /**
   * Adds an item to the end of the array.
   * @param item The item to add.
   */
  addItem(item: U): void {
    this.items.update((items) => [...items, item]);
  }

  /**
   * Edits an existing item in the array.
   * @param item The updated item.
   * @param id The key used to identify the item.
   */
  editItem(item: U, id: keyof U): void {
    this.items.update((items) => items.map((i) => (i[id] === item[id] ? item : i)));
  }

  /**
   * Removes an item from the array.
   * @param item The item to remove.
   * @param id The key used to identify the item.
   */
  deleteItem(item: U, id: keyof U): void {
    this.items.update((items) => items.filter((x) => x[id] !== item[id]));
  }
}

export class StoreItemAsync<T> {
  /**
   * Holds the current value of T and notifies subscribers on changes.
   * @private
   */
  private _item$: BehaviorSubject<T>;

  /**
   * Initializes the store with a default value.
   * @param instance The initial value of type T.
   */
  constructor(instance: T) {
    this._item$ = new BehaviorSubject<T>(instance);
  }

  /**
   * Returns an observable of the stored item for reactive updates.
   * @returns An observable emitting the latest value of type T.
   */
  getItem(): Observable<T> {
    return this._item$.asObservable();
  }

  /**
   * Retrieves the current value of the stored item.
   * @returns The latest value of type T.
   */
  getItemValue(): Readonly<T> {
    return this._item$.getValue();
  }

  /**
   * Updates the stored item and notifies subscribers.
   * @param value The new value of type T to be stored.
   */
  setItem(value: T): void {
    this._item$.next(value);
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
   * A signal that holds the current array of items.
   */
  private _items = signal<T[]>([]);

  /**
   * Exposes items as a read-only signal.
   */
  get items(): Signal<T[]> {
    return this._items;
  }

  /**
   * Set a new list of items.
   */
  set items(value: T[]) {
    this._items.set(value);
  }

  /**
   * Unselect all items.
   */
  clearSelection(): void {
    this._items.update((items) => items.map((item) => ({ ...item, selected: false })));
  }

  /**
   * Select an item and unselect others.
   * @param item The item to be selected.
   */
  getItem(item: T): void {
    this._items.update((items) =>
      items.map((i) => ({
        ...i,
        selected: i === item,
      }))
    );
  }

  /**
   * Get all unselected items, optionally filtering out the selected one when editing.
   * @param skipSelected True to exclude any selected items.
   */
  getItems(skipSelected = false): T[] {
    return skipSelected ? this.items().filter((x) => !x.selected) : this.items();
  }

  /**
   * Add an item.
   * @param item The item to add.
   */
  addItem(item: T): void {
    this._items.update((items) => [...items, item]);
  }

  /**
   * Edit an existing item.
   * @param item The item to change.
   * @param id The identity property of the item.
   */
  editItem(item: T, id: keyof T): void {
    this._items.update((items) => items.map((i) => (i[id] === item[id] ? item : i)));
  }

  /**
   * Remove an item.
   * @param item The item to remove.
   * @param id The identity property of the item.
   */
  deleteItem(item: T, id: keyof T): void {
    this._items.update((items) => items.filter((i) => i[id] !== item[id]));
  }
}
