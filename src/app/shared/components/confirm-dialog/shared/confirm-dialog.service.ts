import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { DialogOptions } from './confirm-dialog.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Class representing a service for the `ConfirmDialogComponent`
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  /**
   * A property that holds a reference to the opened confirmation dialog.
   * @public
   */
  dialogRef!: MatDialogRef<ConfirmDialogComponent>;

  /**
   * Initializes properties
   * @param dialog A property to handle the opening of a dialog box
   */
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  /**
   * Method to open dialog with options
   * @param options Options fot the dialog UI
   */
  open(options: DialogOptions): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText ?? this.translate.instant('global.cancel'),
        confirmText: options.confirmText ?? this.translate.instant('global.ok'),
      },
    });
  }

  /**
   * Method that listens to the dialogs afterClosed event.
   * @returns An observable that is notified after the confirmation dalog has closed.
   */
  confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map((result) => {
        return result;
      })
    );
  }
}
