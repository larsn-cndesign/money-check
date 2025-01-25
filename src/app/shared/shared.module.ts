import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { CurrencyTableComponent } from './components/currency-table/currency-table.component';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { FocusDirective } from './directives/focus.directive';
import { SkipSanitizeHtmlPipe } from './pipes/skip-sanitize-html';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CurrencyTableComponent, CurrencyFormComponent, FocusDirective, SkipSanitizeHtmlPipe],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule,
    CurrencyTableComponent,
    CurrencyFormComponent,
    FocusDirective,
    SkipSanitizeHtmlPipe,
  ],
})
export class SharedModule {}
