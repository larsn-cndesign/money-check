import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  /**
   * A property holding http header information
   * @private
   * @readonly
   */
  private readonly httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  /**
   * Initializes services.
   * @param http Manage http requests.
   * @param errorService Application error service.
   */
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  /**
   * Get all items from server.
   * @returns Observer of an array of `T` objects.
   * @template T Any type of object to be returned.
   */
  getAllItems<T>(route: string): Observable<T[]> {
    return this.http.get<T[]>(`/api/${route}`).pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Get all items from server based on an idintifier.
   * @param id The identity number of the selected item.
   * @returns Observer of an array of `T` objects.
   * @template T Any type of object to be returned.
   */
  getItemsById<T>(id: number, route: string): Observable<T[]> {
    return this.http.get<T[]>(`/api/${route}`, { params: { id } }).pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Get item from server based on an idintifier.
   * @param id The identity number of the selected item.
   * @returns Observer of an array of `T` objects.
   * @template T Any type of object to be returned.
   */
  getItemById<T>(id: number, route: string): Observable<T> {
    return this.http.get<T>(`/api/${route}`, { params: { id } }).pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Post an item to database.
   * @param item The item to be added.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the added item.
   * @template T Any type of object to be added.
   */
  postItem<T>(item: T, route: string): Observable<T> {
    return this.http
      .post<T>(`/api/${route}`, JSON.stringify(item), this.httpOptions)
      .pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Post an item to database.
   * @param item The item to be added.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the added item.
   * @template T The type of object to be added.
   * @template U The type of object to be returned.
   */
  postItemVar<T, U>(item: T, route: string): Observable<U> {
    return this.http
      .post<U>(`/api/${route}`, JSON.stringify(item), this.httpOptions)
      .pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Modify an item in database
   * @param item The item to be modified.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the modified item.
   * @template T Any type of object to be modified.
   */
  putItem<T>(item: T, route: string): Observable<T> {
    return this.http
      .put<T>(`/api/${route}`, JSON.stringify(item), this.httpOptions)
      .pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Modify an item in database
   * @param item The item to be modified.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the modified item.
   * @template T Any type of object to be modified.
   * @template U The type of object to be returned.
   */
  putItemVar<T, U>(item: T, route: string): Observable<U> {
    return this.http
      .put<U>(`/api/${route}`, JSON.stringify(item), this.httpOptions)
      .pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Delete an item in database.
   * @param item The item to be deleted.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the deleted item.
   * @template T Any type of object to be deleted.
   */
  deleteItem<T>(item: T, route: string): Observable<T> {
    const optionsWithBody = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(item),
    };
    return this.http.delete<T>(`/api/${route}`, optionsWithBody).pipe(catchError(this.errorService.handleHttpError));
  }

  /**
   * Delete an item in database.
   * @param item The item to be deleted.
   * @param route The endpoint to send the request to.
   * @returns An observable of a `T` representing the deleted item.
   * @template T The type of object to be deleted.
   * @template U The type of object to be returned.
   */
  deleteItemVar<T, U>(item: T, route: string): Observable<U> {
    const optionsWithBody = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(item),
    };
    return this.http.delete<U>(`/api/${route}`, optionsWithBody).pipe(catchError(this.errorService.handleHttpError));
  }
}
