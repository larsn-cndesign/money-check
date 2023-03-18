import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { MessageBox } from './message-box.model';

/**
 * Class representing a service for managing a message box.
 */
@Injectable({
  providedIn: 'root',
})
export class MessageBoxService {
  /**
   * An observer of a `MessageBox` object.
   * @private
   */
  private _model$: BehaviorSubject<MessageBox>;

  /**
   * A boolean flag indicating if the message box is open or not.
   * @public
   */
  private _isOpen = false;

  /**
   * Getter property for the message box observable `_model$`
   * @returns An observable of a `MessageBox` object.
   */
  get model$(): Observable<MessageBox> {
    return this._model$.asObservable();
  }

  /**
   * Getter property for the isOpen property
   * @returns The isOpen property
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Setter property for the action control
   * @returns The action control
   */
  set isOpen(value: boolean) {
    this._isOpen = value;
  }

  /**
   * Initializes properties
   */
  constructor() {
    this._model$ = new BehaviorSubject<MessageBox>(new MessageBox());
  }

  /**
   * Opens the message box with a custom message.
   * @param message A MessageBox object.
   */
  show(message = new MessageBox()): void {
    this.isOpen = true;
    this._model$.next(message);
  }

  /**
   * Hides the message box.
   */
  hide(): void {
    this.isOpen = false;
    this._model$.next(new MessageBox());
  }
}
