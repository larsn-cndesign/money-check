import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmDialogService } from './../confirm-dialog/shared/confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SkipSanitizeHtmlPipe } from '../../pipes/skip-sanitize-html';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [ConfirmDialogComponent, SkipSanitizeHtmlPipe],
  exports: [ConfirmDialogComponent],
  providers: [ConfirmDialogService],
})
export class ConfirmDialogModule {}
