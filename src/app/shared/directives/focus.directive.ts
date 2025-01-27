import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Class representing a directive to raise event when an input is focused and blured.
 */
@Directive({
  selector: '[appFocus]',
  standalone: true,
})
export class FocusDirective {
  /**
   * An event emitter that emits when a HTMLElement is getting focus.
   */
  @Output() focused = new EventEmitter();

  /**
   * An event emitter that emits when a HTMLElement is losing focus.
   */
  @Output() unfocused = new EventEmitter();

  /**
   * Listen to focus event and emits when fired.
   * @param e The HTMLElement event.
   */
  @HostListener('focus', ['$event'])
  public onFocus(e: Event): void {
    e.preventDefault();
    this.focused.emit();
  }

  /**
   * Listen to focusout event and emits when fired.
   * @description Emits after a short delay to be able to respond to events in other controls.
   * @param e The HTMLElement event.
   */
  @HostListener('focusout', ['$event'])
  public onFocusOut(e: Event): void {
    e.preventDefault();
    setTimeout(() => {
      this.unfocused.emit();
    }, 180);
  }
}
