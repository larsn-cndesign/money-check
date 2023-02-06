/**
 * Interface representing confirmation dialog optionsw.
 */
export interface DialogOptions {
  /**
   * The title of the dialog.
   * @public
   */
  title: string;

  /**
   * The message to confirm.
   * @public
   */
  message: string;

  /**
   * The text of the cancel button (optional).
   * @public
   */
  cancelText?: string;

  /**
   * The text of the confirm button (optional).
   * @public
   */
  confirmText?: string;
}
