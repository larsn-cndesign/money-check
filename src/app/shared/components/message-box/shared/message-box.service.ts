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
   * Getter property for the action control
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
   * @param message A MessageBox object
   */
  show(message = new MessageBox()): void {
    this.isOpen = true;
    this._model$.next(message);

    // switch (message.type) {
    //   case MessageType.Success:
    //     this.message.border = '10px solid #4fc36a';
    //     this.message.color = '#4fc36a';
    //     this.message.icon = 'check_circle';
    //     this.message.close = { 'message-close message-cancel message-sx': true };
    //     break;
    //   case MessageType.Info:
    //     this.message.border = '10px solid #60a6ff';
    //     this.message.color = '#60a6ff';
    //     this.message.icon = 'info';
    //     this.message.close = { 'message-close message-cancel message-ix': true };
    //     break;
    //   case MessageType.Warning:
    //     this.message.border = '10px solid #E5AD0B';
    //     this.message.color = '#E5AD0B';
    //     this.message.icon = 'warning';
    //     this.message.close = { 'message-close message-cancel message-wx': true };
    //     break;
    //   case MessageType.Error:
    //     this.message.border = '10px solid #ff6b6b';
    //     this.message.color = '#ff6b6b';
    //     this.message.icon = 'error';
    //     this.message.close = { 'message-close message-cancel message-dx': true };
    //     break;
    // }
  }

  hide(): void {
    this.isOpen = false;
    this._model$.next(new MessageBox());
  }
}
