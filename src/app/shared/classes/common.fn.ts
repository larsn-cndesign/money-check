import { formatDate } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Helper method when using multiple subscription in the same component.
 * @description The takeUntil operator is used to unsubscribe from the interval observable when the
 * notifier$ subject emits a value.
 * @param observable Observable of any type.
 * @param notifier$ A notifier subject emitting values.
 * @returns Observable of any type.
 *
 *
 * @usageNote
 *
 *  ### Load categories and units from server
 *
 * Example: Initialize subject and service and subscribe to http requests (getCategories(), getUnits()).
 * Unsubscribe to all subscritions in the ngOnDestroy() method.
 * Use `notifier$.complete() to complete the notifier$ subject so it will not keep emitting values after the component is destroyed.
 *
 * ```typescript
 * private subject$ = new Subject<void>();
 *
 * constructor(private service: MyService) {}
 *
 * loadCategories(): void {
 *   pipeTakeUntil(this.service.getCategories(), this.subject$).subscribe();
 * }
 *
 * loadUnits(): void {
 *   pipeTakeUntil(this.service.getUnits(), this.subject$).subscribe();
 * }
 *
 * ngOnDestroy(): void {
 *   this.subject$.next();
 *   this.subject$.complete();
 * }
 * ```
 */
export function pipeTakeUntil<T>(observable: Observable<T>, notifier$: Subject<void>): Observable<T> {
  return observable.pipe(takeUntil(notifier$));
}

/**
 * Format a date to a Swedish date format.
 * @param value The date to format.
 * @returns Date in string format.
 */
export function toDate(value: string | number | Date): string {
  return formatDate(value, 'yyyy-MM-dd', 'sv-SE');
}

/**
 * Convert a date to a number represented as milliseconds.
 * @param value The value to convert.
 * @returns Date in milliseconds.
 */
export function toTime(value: string | number | Date): number {
  return new Date(toDate(value)).getTime();
}

/**
 * Make a deep copy of an object, removing any references to the old object.
 * @param object The object to be copied.
 * @returns A deep copy of the provided object.
 */
export function deepCoyp(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Convert an any type to a number.
 * @param value The number to convert.
 * @returns The converted number or 0 if conversion failed.
 */
export function toNumber(value: any): number {
  const val = value.toString().replace(',', '.');
  return isNaN(val) ? 0 : Number.parseFloat(val);
}

/**
 * Check if an any type is of type number.
 * @param value The value to check.
 * @returns True if the input value is a number.
 */
export function isNumber(value: any): boolean {
  const val = value.toString().replace(',', '.');
  return !isNaN(val);
}

/**
 * Count the number of lines in a string
 * @param text The text to get the line count for (optional).
 * @returns The number of lines in a string.
 */
export function lineCount(text?: string): number {
  return text ? text.split(/\r\n|\r|\n/).length : 0;
}

/**
 * Sorting algorithm for number or strings.
 * @param a The first value
 * @param b The second value to compare with the first value
 * @param asc True if sorted in ascending order
 * @returns A negative number if "a" is less than "b", othervise a positive number.
 * If sorting in descenting order the sign is reversed.
 */
export function compare(a: number | string | undefined, b: number | string | undefined, asc: boolean): number {
  if (a === undefined || b === undefined) {
    return 0;
  }
  return (a < b ? -1 : 1) * (asc ? 1 : -1);
}
