import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { dropDown, slideInFromLeft } from './shared/message-box.animations';
import { MessageBox } from './shared/message-box.model';
import { MessageBoxService } from './shared/message-box.service';

/**
 * Class representing a messag box.
 */
@Component({
    selector: 'app-message-box',
    imports: [SharedModule],
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss'],
    animations: [slideInFromLeft, dropDown]
})
export class MessageBoxComponent implements OnInit, OnDestroy {
  /**
   * The message of the mesasge box.
   * @public
   */
  @Input() message!: MessageBox;

  /**
   * A boolean flag to indicate if the message box is opened or not.
   * @public
   * @default false
   */
  isOpen = false;

  /**
   * A timer property holding the timeout id.
   * @private
   */
  private timer!: number;

  /**
   * The subscrition object subscribing to a `MessageBox` observable.
   * @public
   */
  subscription!: Subscription;

  /**
   * Initializes porperties
   * @param messageBoxService Service for managing a message box.
   */
  constructor(private messageBoxService: MessageBoxService) {}

  /**
   * @description Subscribes to a `MessageBox` object. When notified it shows the message box
   * for 2s before its automatically closed.
   */
  ngOnInit(): void {
    this.subscription = this.messageBoxService.model$.subscribe((message: MessageBox) => {
      this.isOpen = this.messageBoxService.isOpen;

      this.message = message;
      clearTimeout(this.timer);

      if (message) {
        this.message = message;
        clearTimeout(this.timer);

        switch (message.type) {
          case 'success':
            this.timer = window.setTimeout(() => {
              this.isOpen = false;
            }, 3500);
            break;
          case 'simple':
            this.timer = window.setTimeout(() => {
              this.isOpen = false;
            }, 2000);
            break;
        }
      }
    });
  }

  /**
   * @description Unsubscribe from the message box subscription.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Close message box
   */
  onOK(): void {
    this.messageBoxService.hide();
  }
}
