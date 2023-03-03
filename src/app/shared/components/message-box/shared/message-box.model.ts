/**
 * Class for display message to the user
 */
export class MessageBox {
  /**
   * The class to use for different themes depending on the message type.
   */
  colorClass: string;

  /**
   * Initialize properties
   * @param content The message content (@default '').
   * @param title The title of the message box (@default 'Sparad').
   * @param type The type of message box to show (@default 'simple').
   *
   */
  constructor(public title = 'Sparad', public content = '', public type: MessageType = 'simple') {
    this.colorClass = 'message ' + type.toString();
  }
}

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'simple';
