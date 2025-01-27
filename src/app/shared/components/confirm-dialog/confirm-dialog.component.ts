import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DialogOptions } from './shared/confirm-dialog.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SkipSanitizeHtmlPipe } from '../../pipes/skip-sanitize-html';

/**
 * Class representing a confirmation dialog
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, SkipSanitizeHtmlPipe],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  /**
   * Initializes properties
   * @param data Options for the dialog box
   * @param mdDialogRef A reference to the `ConfirmDialogComponent`
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  /**
   * Close dialog and emit true to indicate that the cancel button was clied.
   * @description The dialog opener is listening to this event.
   */
  onCancel(): void {
    this.close(false);
  }

  /**
   * Close dialog and emit true to indicate that the confirm button was clied.
   * @description The dialog opener is listening to this event.
   */
  onConfirm(): void {
    this.close(true);
  }

  /**
   * Close dialog and emit value to dialog opener
   * @param value A boolean flag to indicate if the confirm or canceled button was clicked.
   * If true, the confirm button was clicked.
   */
  private close(value: any): void {
    this.mdDialogRef.close(value);
  }
}
